import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";

function Statistics() {
  const { state } = useAppContext();
  const { isAdmin } = state;
  return <div>{isAdmin && <AdminPanel />}</div>;
}

export default Statistics;
