import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function AdminPanel() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <div className="bg-gray-800 text-white p-4">
      <nav>
        <ul className="flex space-x-4 items-center justify-between">
          <li>
            <NavLink
              to="/adminpanel/main"
              className="hover:text-gray-300"
              activeClassName="text-gray-300"
            >
              Strona Główna
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adminpanel/add"
              className="hover:text-gray-300"
              activeClassName="text-gray-300"
            >
              Dodaj nowy produkt
            </NavLink>
          </li>
          <li className="flex-grow">
            <NavLink
              to="/adminpanel/statistics"
              className="hover:text-gray-300"
              activeClassName="text-gray-300"
            >
              Statystyki
            </NavLink>
          </li>
          <li className="ml-auto">
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none"
            >
              Wyloguj się
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminPanel;
