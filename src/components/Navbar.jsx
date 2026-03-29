import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCrown } from "react-icons/fa";

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">Dyslexis</div>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
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
        {/* <div className="lang-selector">
          <FaLanguage className="lang-icon" />
          <select value={user.lang} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div> */}
        
        {user.isPro ? (
          <div className="pro-status pro-active">
            <FaCrown /> PRO
          </div>
        ) : (
          <div className="pro-status pro-inactive">
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
