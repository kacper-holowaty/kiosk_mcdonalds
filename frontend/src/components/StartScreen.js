import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SiMcdonalds } from "react-icons/si";
import { useKeycloak } from "@react-keycloak/web";

function StartScreen() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const headers = useMemo(
    () => [
      "Mam smaka na maka!",
      "I'm lovin' it!",
      "Jakość, którą znasz, i smak, który kochasz...",
      "Świat smakuje lepiej z McDonald's.",
      "Pyszne chwile zawsze zaczynają się od McDonald's.",
    ],
    []
  );

  const currentIndex = useRef(0);
  const [slogan, setSlogan] = useState(headers[currentIndex.current]);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % headers.length;
      setSlogan(headers[currentIndex.current]);
    }, 8000);

    return () => clearInterval(interval);
  }, [headers]);

  const handleClick = (e) => {
    if (e.target.tagName === "BUTTON") {
      return;
    }
    navigate("/start");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      onClick={handleClick}
    >
      <Link to="/adminpanel/main">
        <button
          className="fixed top-4 right-4 bg-mcdonalds hover:bg-red-700 px-6 py-3 text-white rounded-lg text-xl"
          onClick={() =>
            keycloak.login({
              redirectUri: window.location.origin + "/adminpanel/main",
            })
          }
        >
          Zaloguj się
        </button>
      </Link>
      <div className="text-9xl font-bold mb-28">
        <SiMcdonalds />
      </div>
      <h2 className="text-4xl font-bold mb-4">{slogan}</h2>
      <h3 className="text-lg">Kliknij, aby złożyć zamówienie</h3>
    </div>
  );
}

export default StartScreen;
