// src/utils/nextRoute.js
export function getNextRoute(signUpData) {
    // if verification never completed (or was skipped) → send them there
    if (
      !signUpData.verificationDetails ||
      signUpData.verificationDetails.skipped
    ) {
      return "/verification";
    }
  
    // once verification is done, if profession missing or skipped → send them there
    if (
      !signUpData.professionalDetails ||
      signUpData.professionalDetails.skipped
    ) {
      return "/profession";
    }
  
    // otherwise they’re finished onboarding
    return "/welcome";
  }
  