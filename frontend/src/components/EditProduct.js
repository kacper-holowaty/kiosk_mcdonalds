import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

function EditProduct({ item, stopEditing }) {
  const [extraItems, setExtraItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useAppContext();

  const handleAddToBasket = () => {
    const editedItem = {
      ...item,
      extraItems,
      quantity,
    };

    dispatch({ type: "ADD_TO_BASKET", payload: editedItem });
    stopEditing();
    alert(`Dodano ${editedItem.name} x${editedItem.quantity} do koszyka!`);
  };

  return (
    <div>
      <h3>Edytuj produkt: {item.name}</h3>
      <div>
        <label>Dodatkowe elementy:</label>
        <input
          type="text"
          value={extraItems}
          onChange={(e) => setExtraItems(e.target.value)}
        />
      </div>
      <div>
        <label>Ilość:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button onClick={handleAddToBasket}>Dodaj do koszyka</button>
      <button onClick={stopEditing}>Anuluj</button>
    </div>
  );
}

export default EditProduct;
