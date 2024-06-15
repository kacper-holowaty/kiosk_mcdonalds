import React from "react";
import ChooseOrderType from "./ChooseOrderType";
import StartScreen from "./StartScreen";
import { Route, Routes } from "react-router-dom";
import Menu from "./Menu";
import Basket from "./Basket";
import PaymentPanel from "./PaymentPanel";
import ThankYou from "./ThankYou";
import AdminMain from "./admin/AdminMain";
import Statistics from "./admin/Statistics";
import AddProductForm from "./admin/AddProductForm";
import NotFound from "./NotFound";
import AdminMenu from "./admin/AdminMenu";

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url("/top-view-burger-orange-background.jpg")',
      }}
    >
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
        <Route path="/adminpanel/main" element={<AdminMain />} />
        <Route path="/adminpanel/menu" element={<AdminMenu />} />
        <Route path="/adminpanel/add" element={<AddProductForm />} />
        <Route path="/adminpanel/statistics" element={<Statistics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
