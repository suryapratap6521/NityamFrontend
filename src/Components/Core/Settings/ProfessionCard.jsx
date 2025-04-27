import React from 'react';
import { Box, Typography, Button } from "@mui/material";

const ProfessionCard = ({ onComplete }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h6" gutterBottom>
      Professional details missing
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Add your profession and hourly rate so others can hire you.
    </Typography>
    <Button variant="contained" onClick={onComplete}>
      Add Profession Details
    </Button>
  </Box>
);

export default ProfessionCard;
