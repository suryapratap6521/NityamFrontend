// OnboardingRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SKIP_THRESHOLD = 60 * 1000; // 24 hours in milliseconds

const OnboardingRoute = ({ children }) => {
  const signUpData = useSelector((state) => state.auth.signUpData);
  const now = Date.now();

  // Mandatory step: Profile Details must be provided.
  if (!signUpData.profileDetails) {
    return <Navigate to="/profiledetails" replace />;
  }

  // Mandatory step: Community Address must be provided.
  if (!signUpData.communityAddress) {
    return <Navigate to="/communityaddress" replace />;
  }

  // Mandatory step: Community (for example, communityName) must be provided.
  if (!signUpData.communityName) {
    return <Navigate to="/community" replace />;
  }

  // Verification step: Allow a skip, but force completion if skip expired.
  if (!signUpData.verificationDetails) {
    return <Navigate to="/verification" replace />;
  } else if (
    signUpData.verificationDetails.skipped &&
    now - signUpData.verificationDetails.skippedAt > SKIP_THRESHOLD
  ) {
    return <Navigate to="/verification" replace />;
  }

  // Profession step: Allow a skip, but force completion if skip expired.
  if (!signUpData.professionalDetails) {
    return <Navigate to="/profession" replace />;
  } else if (
    signUpData.professionalDetails.skipped &&
    now - signUpData.professionalDetails.skippedAt > SKIP_THRESHOLD
  ) {
    return <Navigate to="/profession" replace />;
  }

  return children;
};

export default OnboardingRoute;
