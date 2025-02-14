
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import LockerDropoff from "./pages/LockerDropoff";
import PaymentPage from "./pages/PaymentPage";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/locker-dropoff" element={<LockerDropoff />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
