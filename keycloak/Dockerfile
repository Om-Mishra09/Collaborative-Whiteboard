FROM quay.io/keycloak/keycloak:latest

COPY realm-export.json /opt/keycloak/data/import/

CMD ["start-dev", "--import-realm"]