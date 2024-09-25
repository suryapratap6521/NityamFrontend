import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    // console.log(user._id);
    console.log(admin);
    return (
      <Badge
        sx={{
          px: 2,
          py: 1,
          borderRadius: "10px", 
          m: 1,
          mb: 2,
          backgroundColor: "success.main", 
          color: "success.contrastText", 
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "success.dark", 
          },
        }}
        onClick={handleFunction}
      >
        {user.firstName + " "+ user.lastName}
        {admin === user._id && <span> (Admin)</span>}
        <CloseIcon pl={1} />
      </Badge>
    );
  };
  
export default UserBadgeItem;
