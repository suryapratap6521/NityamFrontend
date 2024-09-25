import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@mui/material'
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';

const Confirmationmodal = ({ modalData }) => {
  const handleClose = () => {
    modalData?.btn2handle && modalData.btn2handle();
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    
    <Dialog open={Boolean(modalData)} onClose={handleClose}>
      <DialogTitle>{modalData.text1}</DialogTitle>
      <DialogContent>
        <p>{modalData.text2}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={modalData?.btn1handle} variant="contained" color='error'>
          {modalData?.btn1text}
        </Button>
        <Button onClick={handleClose} variant="contained" color="success">
          {modalData?.btn2text}
        </Button>
      </DialogActions>
    </Dialog>
   
    
  );
};

export default Confirmationmodal;
