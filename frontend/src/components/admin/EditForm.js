import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";

function EditForm() {
  const { state } = useAppContext();
  const { isAdmin } = state;
  return (
    <div>
      {isAdmin && <AdminPanel />}
      <h1>Hej jestem edit form</h1>
    </div>
  );
}

export default EditForm;
