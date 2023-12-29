import React, { createContext, useReducer, useContext } from "react";
import axios from "axios";

const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    /*Tutaj initialState reducera*/
  });

  const contextValue = {
    state,
    dispatch,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Nieprawidłowe użycie kontekstu!");
  }
  return context;
};
