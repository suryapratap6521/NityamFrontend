import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const texts = [
  "Welcome to our website!",
  "Enjoy our latest offers!",
  "Contact us for more information!",
  "Subscribe to our newsletter!",
];

const scrollUp = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const scrollDown = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ChangingTextBanner = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 1000); // Duration of the animation
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const nextTextIndex = (currentTextIndex + 1) % texts.length;

  return (
    <Box
      sx={{
        overflow: 'hidden',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <Typography
        key={currentTextIndex}
        variant="h6"
        component="div"
        sx={{
          position: 'absolute',
          animation: isAnimating ? `${scrollUp} 1s ease forwards` : 'none',
          background: "linear-gradient(90deg, #1E8D44  0%,  #F9ED25 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {texts[currentTextIndex]}
      </Typography>
      {isAnimating &&
      <Typography
        key={nextTextIndex}
        variant="h6"
        component="div"
        sx={{
          position: 'absolute',
          animation: isAnimating ? `${scrollDown} 1s ease forwards` : 'none',
          background: "linear-gradient(90deg, #1E8D44  0%,  #F9ED25 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          
        }}
      >
        {texts[nextTextIndex]}
      </Typography>
      }
    </Box>
  );
};

export default ChangingTextBanner;
