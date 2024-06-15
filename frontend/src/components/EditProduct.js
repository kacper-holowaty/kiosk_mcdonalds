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
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Dodatkowe elementy:
        </label>
        <input
          type="text"
          className="mt-1 p-2 border rounded-md w-full text-black"
          value={extraItems}
          onChange={(e) => setExtraItems(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Ilość:
        </label>
        <input
          type="number"
          className="mt-1 p-2 border rounded-md w-full text-black"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 1 && value <= 50) {
              setQuantity(value);
            }
          }}
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleAddToBasket}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md"
        >
          Dodaj do koszyka
        </button>
        <button
          onClick={stopEditing}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default EditProduct;
