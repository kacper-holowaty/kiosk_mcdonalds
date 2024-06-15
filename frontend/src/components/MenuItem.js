import React, { useState } from "react";
import EditProduct from "./EditProduct";

function MenuItem({ item }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`flex bg-mcdonalds bg-opacity-100 p-4 mt-1 mb-1 ml-2 items-center text-white rounded-lg ${
        isEditing ? "flex-col" : "justify-between"
      }`}
    >
      <h4>
        <span className="mr-2">{item.name}</span>
        <span>{item.price}</span>
      </h4>

      {isEditing ? (
        <div>
          <EditProduct item={item} stopEditing={() => setIsEditing(false)} />
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-400 p-2 rounded-lg text-black"
        >
          Wybierz
        </button>
      )}
    </div>
  );
}

export default MenuItem;
