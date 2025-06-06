import { Navbar } from "../components/Navbar";
import "./Home.css";
import illustration from "../assets/illustration-login.svg";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="text-section">
          <p className="greeting">Bem vinda,</p>
          <h1 className="username">Ana.</h1>
          <p className="subtitle">Pronta para embarcar em uma nova leitura?</p>

          <div className="buttons">
            <Link to="/clubes?tab=meus" className="btn black">Ver meus clubes</Link>
            <Link to="/clubes?tab=encontrar" className="btn white">Encontrar clubes</Link>

          </div>
        </div>
        <div className="illustration">
          <img src={illustration} alt="Ilustração de leitura" />
        </div>
      </div>
    </div>
  );
}
