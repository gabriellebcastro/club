import { Navbar } from "../components/Navbar";
import "./Home.css";
import illustration from "../assets/illustration-login.svg";

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
            <button className="btn black">Ver meus clubes</button>
            <button className="btn white">Encontrar clubes</button>
          </div>
        </div>
        <div className="illustration">
          <img src={illustration} alt="Ilustração de leitura" />
        </div>
      </div>
    </div>
  );
}
