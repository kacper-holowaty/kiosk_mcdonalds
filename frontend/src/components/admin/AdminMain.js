import React from "react";
import AdminPanel from "./AdminPanel";
import { useKeycloak } from "@react-keycloak/web";

function AdminMain() {
  const { keycloak } = useKeycloak();

  return (
    <div>
      {keycloak.authenticated && <AdminPanel />}
      {keycloak.authenticated ? (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
            <h1 className="text-3xl font-bold text-center text-grey mb-6">
              Zalogowano jako {keycloak.tokenParsed.preferred_username}!
            </h1>
            <div className="text-xl text-gray-800 leading-relaxed mb-4">
              Witaj w panelu administratora! Możesz tutaj sprawdzić statystyki
              sprzedaży w McDonalds oraz dowolnie edytować produkty dostępne w
              restauracji.
            </div>
            <div className="text-xl text-gray-800 leading-relaxed">
              Jeśli nie masz możliwości dodawania nowych produktów lub edycji
              aktualnego menu w McDonalds, musisz zalogować się jako
              administrator.
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xl">Nic tu nie ma. Musisz się zalogować.</div>
      )}
    </div>
  );
}

export default AdminMain;
