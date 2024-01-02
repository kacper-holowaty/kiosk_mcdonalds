import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";

function AddProductForm() {
  const { state } = useAppContext();
  const { isAdmin } = state;
  return <div>{isAdmin && <AdminPanel />}</div>;
}

export default AddProductForm;
