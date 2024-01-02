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
            <NavLink to="/adminpanel/edit">Edit Product</NavLink>
          </li>
          <li>
            <NavLink to="/adminpanel/add">Add Product</NavLink>
          </li>
          <li>
            <NavLink to="/adminpanel/statistics">Statistics</NavLink>
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
