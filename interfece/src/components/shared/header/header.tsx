
import { NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">P</div>

        <div className="header-title">
          <h2>PURE Energy</h2>
          <span>MIS Assistant</span>
        </div>
      </div>

      <nav className="header-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/leads">
          Leads
        </NavLink>
      </nav>
    </header>
  );
}
