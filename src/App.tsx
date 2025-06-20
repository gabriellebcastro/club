import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/Login";
import { RegisterForm } from "./components/Register";
import { Home } from "./components/Home";
import { ClubesPage } from "./components/Clubes";
import { RecoverPassword } from "./components/RecoverPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={< Home/>} />
        <Route path="/clubes" element={< ClubesPage/>} />
        <Route path="/recover" element={< RecoverPassword/>}/>
      </Routes>
    </Router>
  );
}

export default App;
