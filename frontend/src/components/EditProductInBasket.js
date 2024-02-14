import React, { useState } from "react";

function EditProductInBasket({ item, stopEditing, onSubmit }) {
  const [extraItems, setExtraItems] = useState(item.extraItems || []);
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const updateBasket = () => {
    const updatedItem = {
      ...item,
      extraItems,
      quantity,
    };

    onSubmit(updatedItem);
    stopEditing();
  };

  return (
    <div className="bg-white p-4 w-1/3 mb-2">
      <h3 className="text-xl font-semibold mb-2">
        Edytuj produkt: {item.name}
      </h3>
      <div className="mb-4">
        <label className="block">Dodatkowe elementy:</label>
        <input
          type="text"
          className="w-full border p-2"
          value={extraItems}
          onChange={(e) => setExtraItems(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Ilość:</label>
        <input
          type="number"
          className="w-full border p-2"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 1 && value <= 50) {
              setQuantity(value);
            }
          }}
        />
      </div>
      <div className="flex">
        <button
          onClick={updateBasket}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Zaktualizuj element
        </button>
        <button
          onClick={stopEditing}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default EditProductInBasket;
