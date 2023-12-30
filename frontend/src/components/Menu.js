import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import MenuItem from "./MenuItem";
import axios from "axios";

function Menu() {
  const { state, dispatch } = useAppContext();
  const { products } = state;

  return (
    <div>
      <h1>Wybierz, na co masz dziś ochotę...</h1>
      <ul>
        {products.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default Menu;
