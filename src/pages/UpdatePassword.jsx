import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetPassword } from "../services/operations/authApi";
import { Typography, TextField, Button, IconButton, Container, Grid, Paper } from '@mui/material';
import Loader from '../Components/Common/Loader';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { styled } from '@mui/system';
import toast from 'react-hot-toast';
import { SpaceBarOutlined } from '@mui/icons-material';

const UpdatePassword = () => {
    const location = useLocation();
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { password, confirmPassword } = formData;

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center',mt:15 }}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Enter New Password
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Almost done! Enter a new password and you're all set.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={handleOnChange}
                                    />
                                    <span onClick={() => setShowPassword(!showPassword)} sx={{ position: 'absolute', right: '10px', top: '25px' }}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleOnChange}
                                    />
                                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ position: 'absolute', right: '10px', top: '25px' }}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </Grid>
                            </Grid>
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Reset Password
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <Link to="/login">Back to Login</Link>
                        </Typography>
                    </>
                )}
            </Paper>
        </Container>
    );
};

const StyledTextField = styled(TextField)({
    position: 'relative',
});

export default UpdatePassword;
