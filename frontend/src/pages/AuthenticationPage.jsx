import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../utils/buttonStyles';
import { authUser } from '../redux/userHandle';
import styled from 'styled-components';
import Popup from '../components/Popup';
import { useTranslation } from 'react-i18next'; // Importing the i18n hook

const AuthenticationPage = ({ mode, role }) => {
    const { t } = useTranslation(); // Initialize translation hook

    const bgpic = "https://images.pexels.com/photos/1121097/pexels-photo-1121097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        if (mode === "Register") {
            const name = event.target.userName.value;

            if (!name) {
                setUserNameError(true);
                return;
            }

            if (role === "Seller") {
                const shopName = event.target.shopName.value;

                if (!shopName) {
                    setShopNameError(true);
                    return;
                }

                const sellerFields = { name, email, password, role, shopName };
                dispatch(authUser(sellerFields, role, mode));
            } else {
                const customerFields = { name, email, password, role };
                dispatch(authUser(customerFields, role, mode));
            }
        } else if (mode === "Login") {
            const fields = { email, password };
            dispatch(authUser(fields, role, mode));
        }
        setLoader(true);
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'userName') setUserNameError(false);
        if (name === 'shopName') setShopNameError(false);
    };

    useEffect(() => {
        if (status === 'success' && currentRole !== null) {
            navigate('/');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <StyledTypography>
                            {role} {mode}
                        </StyledTypography>

                        {role === "Seller" && mode === "Register" && (
                            <Typography variant="h7">
                                {t('seller_register_description')}
                            </Typography>
                        )}

                        {role === "Customer" && mode === "Register" && (
                            <Typography variant="h7">
                                {t('customer_register_description')}
                            </Typography>
                        )}

                        {mode === "Login" && (
                            <Typography variant="h7">
                                {t('login_description')}
                            </Typography>
                        )}

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {mode === "Register" && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="userName"
                                    label={t('name')}
                                    name="userName"
                                    autoComplete="name"
                                    autoFocus
                                    variant="standard"
                                    error={userNameError}
                                    helperText={userNameError && t('name_required')}
                                    onChange={handleInputChange}
                                />
                            )}
                            {mode === "Register" && role === "Seller" && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="shopName"
                                    label={t('shop_name')}
                                    name="shopName"
                                    autoComplete="off"
                                    variant="standard"
                                    error={shopNameError}
                                    helperText={shopNameError && t('shop_name_required')}
                                    onChange={handleInputChange}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label={t('email')}
                                name="email"
                                autoComplete="email"
                                variant="standard"
                                error={emailError}
                                helperText={emailError && t('email_required')}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={t('password')}
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                variant="standard"
                                error={passwordError}
                                helperText={passwordError && t('password_required')}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label={t('remember_me')}
                            />
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {mode === "Login" ? t('login') : t('signup')}
                                {loader && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </LightPurpleButton>
                            <Grid container justifyContent="center">
                                {mode === "Register" && (
                                    <Grid item>
                                        <Link to="/login" variant="body2">
                                            {t('already_have_account')}
                                        </Link>
                                    </Grid>
                                )}
                                {mode === "Login" && (
                                    <Grid item>
                                        <Link to="/register" variant="body2">
                                            {t('dont_have_account')}
                                        </Link>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: `url(${bgpic})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </Grid>
            <Popup open={showPopup} message={message} onClose={() => setShowPopup(false)} />
        </>
    );
};

const StyledTypography = styled(Typography)`
    font-family: 'Gloock', serif;
    font-size: 40px;
`;

export default AuthenticationPage;
