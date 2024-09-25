import React from 'react';
import { Grid, Button, Typography, Avatar, Paper } from '@mui/material';


const UserCard = ({ user, onClick }) => { // Add onClick prop
    return (
      <Grid item xs={12} key={user._id}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 10,
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Button
            onClick={() => onClick(user._id)} // Pass user ID to onClick handler
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: 10,
            }}
          >
            <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} />
            <div style={{ marginLeft: 10 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", marginTop: 1 }}>
                {user.communityDetails.communityName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {user.email}
              </Typography>
            </div>
          </Button>
        </Paper>
      </Grid>
    );
  };


export default UserCard;
