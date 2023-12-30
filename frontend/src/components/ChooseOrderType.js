import { Link } from "react-router-dom";

function ChooseOrderType() {
  return (
    <>
      <h2>Wybierz rodzaj zamówienia</h2>
      <div>
        <Link to="menu">
          <div>
            <div>Na miejscu</div>
          </div>
        </Link>
        <Link to="menu">
          <div>
            <div>Na wynos</div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ChooseOrderType;
