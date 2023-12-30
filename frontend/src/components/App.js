import { AppProvider } from "../context/AppContext";
import ChooseOrderType from "./ChooseOrderType";
import StartScreen from "./StartScreen";
import { Route, Routes } from "react-router-dom";
import Menu from "./Menu";
import LoginForm from "./LoginForm";
import Basket from "./Basket";

function App() {
  return (
    <>
      <AppProvider>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/start" element={<ChooseOrderType />} />
          <Route path="/start/menu" element={<Menu />} />
          <Route path="/start/menu/basket" element={<Basket />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AppProvider>
    </>
  );
}

export default App;
