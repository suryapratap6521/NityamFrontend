import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import miniLogo from '../../assests/nityam_mlogo.png'; // Adjust path as needed

const WelcomeSplash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After 3 seconds, navigate to the dashboard.
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-600 to-yellow-500">
      <img 
        src={miniLogo} 
        alt="NityamNeeds Logo" 
        className="w-52 h-52 mb-4 animate-bounce" 
      />
      <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
        Welcome to NityamNeeds!
      </h1>
      <p className="text-lg text-white animate-fadeIn delay-200">
        Your journey begins here...
      </p>
    </div>
  );
};

export default WelcomeSplash;
