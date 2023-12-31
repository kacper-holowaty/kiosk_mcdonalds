import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";

function EditProductInBasket({ item, stopEditing, onSubmit }) {
  const [extraItems, setExtraItems] = useState(item.extraItems || []);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  //   const { dispatch } = useAppContext();

  const updateBasket = () => {
    const updatedItem = {
      ...item,
      extraItems,
      quantity,
    };

    // dispatch({ type: "UPDATE_BASKET", payload: updatedItem });
    onSubmit(updatedItem);
    stopEditing();
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
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value, 10)))
          }
        />
      </div>
      <button onClick={updateBasket}>Zaktualizuj element</button>
      <button onClick={stopEditing}>Anuluj</button>
    </div>
  );
}

export default EditProductInBasket;
