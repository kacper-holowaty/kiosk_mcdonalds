import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function AdminPanel() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/adminpanel/main">Strona Główna</NavLink>
          </li>
          <li>
            <NavLink to="/adminpanel/add">Dodaj nowy produkt</NavLink>
          </li>
          <li>
            <NavLink to="/adminpanel/statistics">Statystyki</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>Wyloguj się</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminPanel;
