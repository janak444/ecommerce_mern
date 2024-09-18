import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { fetchProductDetailsFromCart, removeAllFromCart, removeSpecificProduct } from '../../../redux/userSlice';

const PaymentForm = ({ handleBack }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { status, currentUser, productDetailsCart } = useSelector(state => state.user);

    const params = useParams();
    const productID = params.id;

    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [remarks, setRemarks] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const DELIVERY_CHARGE = 50;

    useEffect(() => {
        if (productID) {
            dispatch(fetchProductDetailsFromCart(productID));
        }
    }, [productID, dispatch]);

    // Calculate quantities and total price
    const productsQuantity = currentUser.cartDetails.reduce((total, item) => total + item.quantity, 0);
    let totalPrice = currentUser.cartDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    // Add delivery charge if total price is less than 1000
    if (totalPrice < 1000) {
        totalPrice += DELIVERY_CHARGE;
    }

    const singleProductQuantity = productDetailsCart && productDetailsCart.quantity;
    let totalSingleProductPrice = productDetailsCart && productDetailsCart.price && productDetailsCart.price.cost * productDetailsCart.quantity;

    // Add delivery charge for single product orders if less than 1000
    if (totalSingleProductPrice < 1000) {
        totalSingleProductPrice += DELIVERY_CHARGE;
    }

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const paymentInfo = {
            id: `PMT-${Date.now()}`,
            status: paymentMethod === 'pre_payment' ? 'pending' : 'successful',
        };

        const orderData = {
            buyer: currentUser._id,
            shippingData: currentUser.shippingData,
            orderedProducts: productID ? [productDetailsCart] : currentUser.cartDetails,
            paymentInfo,
            paymentMethod,
            remarks: paymentMethod === 'pre_payment' ? remarks : null,
            productsQuantity: productID ? singleProductQuantity : productsQuantity,
            totalPrice: productID ? totalSingleProductPrice : totalPrice,
        };

        if (productID) {
            dispatch(addStuff("newOrder", orderData));
            dispatch(removeSpecificProduct(productID));
        } else {
            dispatch(addStuff("newOrder", orderData));
            dispatch(removeAllFromCart());
        }
    };

    useEffect(() => {
        if (status === 'added') {
            navigate('/Aftermath');
        } else if (status === 'failed') {
            setMessage("Order Failed");
            setShowPopup(true);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, navigate]);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <form onSubmit={handleSubmit}>
                <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                >
                    <FormControlLabel value="cash_on_delivery" control={<Radio />} label="Cash on Delivery" />
                    <FormControlLabel value="pre_payment" control={<Radio />} label="Pre-Payment" />
                </RadioGroup>

                {paymentMethod === 'pre_payment' ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="body1" gutterBottom>
                                Please scan the QR code below to complete the payment:
                            </Typography>
                            <img src="/path/to/qr-code-image.jpg" alt="QR Code" style={{ width: 200, height: 200 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="remarks"
                                label="Remarks"
                                fullWidth
                                variant="standard"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                ) : null}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                    </Button>
                    <Button variant="contained" type='submit' sx={{ mt: 3, ml: 1 }}>
                        Place order
                    </Button>
                </Box>
            </form>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </React.Fragment>
    );
};

export default PaymentForm;
