import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCrown, FaCheckCircle, FaLock } from "react-icons/fa";
import { trackEvent, getAbTestGroup } from "../utils/analytics";
import "../styles/UpgradePrompt.css";

const translations = {
  en: {
    title: "Unlock Dyslexis Pro",
    subtitle: "Get exclusive access to advanced tools and personalized support.",
    features: [
      "Unlimited Therapy Calls with specialists",
      "Advanced Dyslexia Prediction AI",
      "Personalized Learning Paths",
      "Ad-free experience",
      "Priority Customer Support"
    ],
    cta: "Upgrade to Pro Now",
    cta_alt: "Start Learning Faster!",
    fallback: "Upgrade service is temporarily unavailable. Please try again later.",
    locked: "This feature is restricted to Pro members"
  },
  es: {
    title: "Desbloquea Dyslexis Pro",
    subtitle: "Obtén acceso exclusivo a herramientas avanzadas y apoyo personalizado.",
    features: [
      "Llamadas de terapia ilimitadas con especialistas",
      "IA avanzada de predicción de dislexia",
      "Rutas de aprendizaje personalizadas",
      "Experiencia sin anuncios",
      "Soporte al cliente prioritario"
    ],
    cta: "Actualizar a Pro ahora",
    cta_alt: "¡Empieza a aprender más rápido!",
    fallback: "El servicio de actualización no está disponible temporalmente. Inténtalo de nuevo más tarde.",
    locked: "Esta función está restringida a miembros Pro"
  }
};

const UpgradePrompt = ({ featureName }) => {
  const { user, upgradeToPro } = useAuth();
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);
  const [abTestGroup, setAbTestGroup] = useState("A");

  const lang = user.lang || "en";
  const t = translations[lang] || translations.en;

  useEffect(() => {
    // A/B test assignment from utility
    const group = getAbTestGroup("upgrade_prompt");
    setAbTestGroup(group);
    
    // Analytics: Prompt Impression
    trackEvent("upgrade_prompt_impression", { 
      feature: featureName, 
      abTestGroup: group,
      language: lang
    });
    
    // Mock health check for upgrade service
    const checkService = async () => {
      try {
        const response = await fetch("http://localhost:6001/api/health");
        const data = await response.json();
        setIsServiceAvailable(data.ok);
      } catch (e) {
        setIsServiceAvailable(false);
      }
    };
    checkService();
  }, [featureName, lang]);

  const handleUpgrade = () => {
    // Analytics: Upgrade Click
    trackEvent("upgrade_button_click", { 
      feature: featureName, 
      abTestGroup: abTestGroup,
      language: lang
    });
    
    // Mock upgrade process
    upgradeToPro();
    alert(lang === "es" ? "¡Felicidades! Ahora eres miembro Pro." : "Congratulations! You are now a Pro member.");
  };

  if (!isServiceAvailable) {
    return (
      <div className="upgrade-fallback" role="alert">
        <p>{t.fallback}</p>
      </div>
    );
  }

  return (
    <div className="upgrade-prompt-container" aria-labelledby="upgrade-title">
      <div className="upgrade-card">
        <div className="lock-icon-wrapper">
          <FaLock className="lock-icon" />
        </div>
        <div className="pro-badge">
          <FaCrown /> PRO
        </div>
        <h2 id="upgrade-title">{t.title}</h2>
        <p className="feature-locked-msg">
          <strong>{featureName}</strong>: {t.locked}
        </p>
        <p className="subtitle">{t.subtitle}</p>
        
        <ul className="features-list">
          {t.features.map((feature, index) => (
            <li key={index}>
              <FaCheckCircle className="check-icon" /> {feature}
            </li>
          ))}
        </ul>

        <button 
          className={`upgrade-cta-btn ${abTestGroup === 'B' ? 'benefit-focus' : ''}`}
          onClick={handleUpgrade}
          aria-label={t.cta}
        >
          {abTestGroup === 'A' ? t.cta : `${t.cta} - ${t.cta_alt}`}
        </button>
      </div>
    </div>
  );
};

export default UpgradePrompt;
