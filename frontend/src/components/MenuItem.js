import React, { useState } from "react";
import EditProduct from "./EditProduct";

function MenuItem({ item }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`flex flex-col bg-white shadow-lg rounded-lg p-4 my-2 mx-2 transition-transform duration-200 ease-in-out hover:scale-105`}
    >
      <img
        src={`data:image/jpeg;base64,${item.image}`}
        alt={item.name}
        className="w-full h-32 object-contain rounded-lg mb-4"
      />
      <div className="flex-grow flex flex-col">
        <h4 className="text-lg font-bold text-gray-800 flex-grow">
          {item.name}
        </h4>
        <p className="text-gray-600 mb-2">{item.price} PLN</p>
      </div>

      {isEditing ? (
        <div className="w-full mt-4">
          <EditProduct item={item} stopEditing={() => setIsEditing(false)} />
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200 w-full mt-auto"
        >
          Wybierz
        </button>
      )}
    </div>
  );
}

export default MenuItem;
