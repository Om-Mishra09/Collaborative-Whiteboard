import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "dendrite",
    clientId: "whiteboard"
});

export async function initKeycloak() {
    await keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false });
    return keycloak;
}

export default keycloak;
