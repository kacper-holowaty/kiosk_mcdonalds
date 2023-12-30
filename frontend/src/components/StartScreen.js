import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function StartScreen() {
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
    // Sprawdź, czy kliknięcie pochodzi z przycisku
    if (e.target.tagName === "BUTTON") {
      return;
    }
    // Po kliknięciu w dowolne miejsce na ekranie, przechodzimy do ścieżki /start
    navigate("/start");
  };

  //Routing działa, tylko trzeba w css pomieszać aby obejmowało całą stronę ten div pierwszy
  return (
    <div /*style={{ width: 1024, height: 1024 }}*/ onClick={handleClick}>
      <Link to="/login">
        <button>Zaloguj się</button>
      </Link>
      <h2>{slogan}</h2>
      <h3>Kliknij, aby złożyć zamówienie</h3>
    </div>
  );
}

export default StartScreen;
