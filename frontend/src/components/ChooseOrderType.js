import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function ChooseOrderType() {
  const { dispatch } = useAppContext();
  return (
    <>
      <h2>Wybierz rodzaj zamówienia</h2>
      <div>
        <Link to="menu">
          <div onClick={() => dispatch({ type: "EAT_IN" })}>
            <div>Na miejscu</div>
          </div>
        </Link>
        <Link to="menu">
          <div onClick={() => dispatch({ type: "TAKEOUT" })}>
            <div>Na wynos</div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ChooseOrderType;
