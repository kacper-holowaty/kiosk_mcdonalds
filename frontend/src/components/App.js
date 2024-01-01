import { AppProvider } from "../context/AppContext";
import ChooseOrderType from "./ChooseOrderType";
import StartScreen from "./StartScreen";
import { Route, Routes } from "react-router-dom";
import Menu from "./Menu";
import LoginForm from "./LoginForm";
import Basket from "./Basket";
import PaymentPanel from "./PaymentPanel";
import ThankYou from "./ThankYou";

function App() {
  return (
    <>
      <AppProvider>
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
            path="/start/menu/basket/payment/goodbye"
            element={<ThankYou />}
          />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AppProvider>
    </>
  );
}

export default App;
