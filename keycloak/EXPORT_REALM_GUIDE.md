# Keycloak Realm Export Guide

This guide explains how to export your Keycloak realm configuration (including the "User Registration" setting) to `realm-export.json` so it persists across Docker restarts.

## Prerequisites

- Keycloak is running in Docker
- Admin credentials: `admin` / `admin`
- Realm name: `dendrite`

## Method 1: Using Keycloak Admin CLI (Recommended)

This is the most reliable method for exporting realm configurations.

### Step 1: Access the Keycloak Container

```bash
docker exec -it dentrite-2-keycloak-1 bash
```

(Note: Your container name might be different. Check with `docker ps` to find the exact name)

### Step 2: Authenticate with Admin CLI

```bash
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin
```

### Step 3: Export the Realm

```bash
/opt/keycloak/bin/kcadm.sh get realms/dendrite -o > /tmp/realm-export.json
```

### Step 4: Copy the File from Container to Host

In a **new terminal** (outside the container):

```bash
docker cp dentrite-2-keycloak-1:/tmp/realm-export.json ./keycloak/realm-export.json
```

### Step 5: Verify the Export

Check that `registrationAllowed` is set to `true`:

```bash
grep -A 2 "registrationAllowed" keycloak/realm-export.json
```

You should see:
```json
"registrationAllowed": true,
```

## Method 2: Using Keycloak REST API

If you prefer not to enter the container, you can use the REST API directly.

### Step 1: Get Admin Access Token

```bash
TOKEN=$(curl -X POST 'http://localhost:8080/realms/master/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=admin' \
  -d 'password=admin' \
  -d 'grant_type=password' \
  -d 'client_id=admin-cli' | jq -r '.access_token')
```

### Step 2: Export the Realm

```bash
curl -X GET 'http://localhost:8080/admin/realms/dendrite' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  | jq '.' > keycloak/realm-export.json
```

### Step 3: Verify the Export

```bash
grep -A 2 "registrationAllowed" keycloak/realm-export.json
```

## Method 3: Using Keycloak Admin Console (Manual Export)

1. Go to http://localhost:8080/admin
2. Login with `admin` / `admin`
3. Navigate to **Realm Settings** → **General**
4. Click the **Export** button (if available in your Keycloak version)
5. Save the JSON file to `keycloak/realm-export.json`

**Note:** This method may not be available in all Keycloak versions.

## Important Notes

1. **Full Export vs Partial Export**: The methods above export the full realm configuration. If you need to include users, clients, roles, etc., you may need additional flags or API calls.

2. **Import on Startup**: To automatically import the realm on startup, you would need to:
   - Mount the `realm-export.json` file as a volume
   - Use Keycloak's import feature (requires additional configuration)

3. **Current Setup**: Your current `docker-compose.yml` doesn't automatically import realms. The export is for backup/version control purposes.

## Verifying Registration is Enabled

After exporting, verify that registration is enabled:

```bash
cat keycloak/realm-export.json | grep -A 1 "registrationAllowed"
```

Should show:
```json
"registrationAllowed": true,
```

## Troubleshooting

### Container Name Not Found
```bash
docker ps | grep keycloak
```
Use the exact container name from this output.

### Permission Denied
If you get permission errors, try:
```bash
docker exec -u root -it <container-name> bash
```

### Export File is Empty
Make sure you're authenticated:
```bash
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin
```

Then try the export again.

