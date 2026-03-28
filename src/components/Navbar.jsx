import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaCrown, FaLanguage } from "react-icons/fa";

const Navbar = () => {
  const { user, setLanguage } = useAuth();
  
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="navbar">
      <div className="logo">Dyslexis</div>

      <div className="nav-links">
        <button onClick={() => scrollToSection("home")}>Home</button>
        <button onClick={() => scrollToSection("about")}>About</button>
        <button onClick={() => scrollToSection("services")}>Services</button>
        <button onClick={() => scrollToSection("prediction")}>Prediction</button>
        <button onClick={() => scrollToSection("therapist")}>Therapist</button>
        <button onClick={() => scrollToSection("therapycall")}>TherapistCall</button>
        <button onClick={() => scrollToSection("products")}>Products</button>
        <button onClick={() => scrollToSection("contact")}>FAQs</button>
      </div>

      <div className="nav-extras">
        <div className="lang-selector">
          <FaLanguage className="lang-icon" />
          <select value={user.lang} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
        
        {user.isPro ? (
          <div className="pro-status pro-active">
            <FaCrown /> PRO
          </div>
        ) : (
          <div className="pro-status pro-inactive">
            Free
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
