import React from "react";
// import { useAppContext } from "../context/AppContext";
import ChooseOrderType from "./ChooseOrderType";
import StartScreen from "./StartScreen";
import { Route, Routes } from "react-router-dom";
import Menu from "./Menu";
import LoginForm from "./LoginForm";
import Basket from "./Basket";
import PaymentPanel from "./PaymentPanel";
import ThankYou from "./ThankYou";
import AdminPanel from "./admin/AdminPanel";
import EditForm from "./admin/EditForm";
import Statistics from "./admin/Statistics";
import AddProductForm from "./admin/AddProductForm";

function App() {
  // const { state } = useAppContext();
  // const { isAdmin } = state;
  return (
    <>
      {/* <AppProvider> */}
      {/* {isAdmin && <AdminPanel />} */}
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/start" element={<ChooseOrderType />} />
        <Route path="/start/menu" element={<Menu />} />
        <Route path="/start/menu/basket" element={<Basket />} />
        <Route
          path="/start/menu/basket/payment/:orderId"
          element={<PaymentPanel />}
        />
        <Route
          path="/start/menu/basket/payment/goodbye/:orderId"
          element={<ThankYou />}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/adminpanel/edit" element={<EditForm />} />
        <Route path="/adminpanel/add" element={<AddProductForm />} />
        <Route path="/adminpanel/statistics" element={<Statistics />} />
      </Routes>
      {/* </AppProvider> */}
    </>
  );
}

export default App;
