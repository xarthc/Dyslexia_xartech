import React from "react";
import { useAuth } from "../context/AuthContext";
import UpgradePrompt from "./UpgradePrompt";

const ProFeature = ({ children, featureName }) => {
  const { user } = useAuth();

  if (user && user.isPro) {
    return <>{children}</>;
  }

  return <UpgradePrompt featureName={featureName} />;
};

export default ProFeature;
