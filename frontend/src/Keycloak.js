import Keycloak from "keycloak-js";

const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL

const keycloak = new Keycloak({
  url: `${keycloakUrl}`,
  realm: "mcdonalds-app",
  clientId: "react-client",
});

export default keycloak;
