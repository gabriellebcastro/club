import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/Login";
import { RegisterForm } from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
