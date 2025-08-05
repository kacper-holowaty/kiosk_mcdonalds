import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:32002",
  realm: "mcdonalds-app",
  clientId: "react-client",
});

export default keycloak;
