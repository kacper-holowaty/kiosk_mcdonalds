import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
import EditProduct from "./EditProduct";

function MenuItem({ item }) {
  //   const { dispatch } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  //   const handleChoose = () => {
  //     // Tutaj możesz ustawić stan, aby pokazać komponent edycji
  //     setIsEditing(true);
  //   };
  return (
    <div>
      <h4>
        {item.name} {item.price}
        {isEditing ? (
          <EditProduct item={item} stopEditing={() => setIsEditing(false)} />
        ) : (
          <button onClick={() => setIsEditing(true)}>Wybierz</button>
        )}
      </h4>
    </div>
  );
}

export default MenuItem;
