import { Avatar, Box, Button, Typography, useMediaQuery } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  console.log(user,"this is the user of my profile");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <>
    <Box sx={{ mt: 13, mx: "auto", maxWidth: "50%", px: 2, pb: 4 }}>
      <Typography variant="h1" sx={{ mb: 4, fontSize: "2.5rem", fontWeight: 600, color: "#333" }}>
        My Profile
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", alignItems: "center", justifyContent: "space-between", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", p: 2 }}>
          <Avatar src={user?.image} alt={`profile-${user?.firstName}`} sx={{ width: { xs: "80px", sm: "100px" }, height: { xs: "80px", sm: "100px" }, backgroundColor: "#ddd" }} />
          <Box sx={{ flex: 1, ml: isSmallScreen ? 0 : 4 }}>
            <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>
              {`${user?.firstName} ${user?.lastName}`}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", color: "#555" }}>{user?.email}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate("/dashboard/settings")}
            sx={{ fontSize: "0.875rem", p: 1 }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>About</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate("/dashboard/settings")}
            sx={{ fontSize: "0.875rem", p: 1, mt: 1 }}
          >
            Edit
          </Button>
        </Box>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: user?.additionalDetails?.about ? "#333" : "#555" }}>
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </Typography>
      </Box>

      <Box sx={{ mt: 4, borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#333" }}>Personal Details</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate("/dashboard/settings")}
            sx={{ fontSize: "0.875rem", p: 1, mt: 1 }}
          >
            Edit
          </Button>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
          <div>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>First Name</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {user?.firstName}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>Email</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {user?.email}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>Gender</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {user?.additionalDetails?.gender ?? "Add Gender"}
            </Typography>
          </div>

          <div>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>Last Name</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {user?.lastName}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>Phone Number</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#555" }}>Date Of Birth</Typography>
            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#333" }}>
              {formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}
            </Typography>
          </div>
        </Box>
      </Box>
    </Box>
    </>
  );
}
