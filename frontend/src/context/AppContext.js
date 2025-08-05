import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:32001";

const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    case "EAT_IN":
      return {
        ...state,
        takeout: false,
      };
    case "TAKEOUT":
      return {
        ...state,
        takeout: true,
      };
    case "SET_TAKEOUT_AS_NULL":
      return {
        ...state,
        takeout: null,
      };
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.payload],
      };
    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        basket: state.basket.filter((_, index) => index !== action.payload.id),
      };

    case "CLEAR_BASKET":
      return {
        ...state,
        basket: [],
      };
    case "UPDATE_BASKET":
      const { item: updatedItem, index } = action.payload;
      const updatedBasket = state.basket.map((item, i) =>
        i === index ? updatedItem : item
      );
      return {
        ...state,
        basket: updatedBasket,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    basket: [],
    takeout: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/products`);
        dispatch({ type: "SET_PRODUCTS", payload: response.data });
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const contextValue = {
    state,
    dispatch,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Nieprawidłowe użycie kontekstu!");
  }
  return context;
};
