import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box, Button, Collapse, Stack, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer } from '../../../redux/userHandle';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BlueButton, GreenButton } from '../../../utils/buttonStyles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ShippingPage = ({ handleNext, profile }) => {
  const { t } = useTranslation();
  const { currentUser } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  let shippingData = currentUser.shippingData;

  console.log(shippingData);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });

  const [errors, setErrors] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });

  const [showTab, setShowTab] = useState(false);
  const buttonText = showTab ? 'Cancel' : 'Edit';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const newErrors = {};

    if (formData.address.trim() === '') {
      newErrors.address = t('shippingAddress.addressRequired');
    } else {
      newErrors.address = '';
    }

    if (formData.city.trim() === '') {
      newErrors.city = t('shippingAddress.cityRequired');
    } else {
      newErrors.city = '';
    }

    if (formData.state.trim() === '') {
      newErrors.state = t('shippingAddress.stateRequired');
    } else {
      newErrors.state = '';
    }

    if (formData.country.trim() === '') {
      newErrors.country = t('shippingAddress.countryRequired');
    } else {
      newErrors.country = '';
    }

    if (formData.pinCode.trim() === '' || isNaN(formData.pinCode) || formData.pinCode.length !== 5) {
      newErrors.pinCode = t('shippingAddress.pincodeRequired');
    } else {
      newErrors.pinCode = '';
    }

    if (formData.phoneNo.trim() === '' || isNaN(formData.phoneNo) || formData.phoneNo.length !== 10) {
      newErrors.phoneNo = t('shippingAddress.phoneNumberRequired');
    } else {
      newErrors.phoneNo = '';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === '');
  };

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const [pinCodeError, setPinCodeError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);

  useEffect(() => {
    if (shippingData) {
      setAddress(shippingData.address || '');
      setCity(shippingData.city || '');
      setPinCode(shippingData.pinCode || '');
      setCountry(shippingData.country || '');
      setState(shippingData.state || '');
      setPhoneNo(shippingData.phoneNo || "");
    }
  }, [shippingData]);

  const updateShippingData = (shippingData) => {
    const updatedUser = { ...currentUser, shippingData: shippingData };
    dispatch(updateCustomer(updatedUser, currentUser._id));
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      updateShippingData(formData);
      handleNext();
    }
  };

  const profileSubmitHandler = () => {
    if (validateInputs()) {
      updateShippingData(formData);
    }
  };

  const editHandler = (event) => {
    event.preventDefault()
    if (isNaN(pinCode) || pinCode.length !== 6) {
      setPinCodeError(true)
    }
    else if (isNaN(phoneNo) || phoneNo.length !== 10) {
      setPhoneNoError(true)
    }
    else {
      setPinCodeError(false)
      setPhoneNoError(false)
      const fields = { address, city, state, country, pinCode, phoneNo }
      updateShippingData(fields);
      setShowTab(false)
    }
  };

  return (
    <React.Fragment>
      {
        shippingData && Object.keys(shippingData).length > 0 ? 
          <React.Fragment>
            <StyledTypography variant="h6">
            {t('shippingAddress.address')} : {shippingData && shippingData.address}
            </StyledTypography>
            <StyledTypography variant="h6">
            {t('shippingAddress.city')} : {shippingData && shippingData.city}
            </StyledTypography>
            <StyledTypography variant="h6">
            {t('shippingAddress.state')} : {shippingData && shippingData.state}
            </StyledTypography>
            <StyledTypography variant="h6">
            {t('shippingAddress.country')} : {shippingData && shippingData.country}
            </StyledTypography>
            <StyledTypography variant="h6">
            {t('shippingAddress.pinCode')} : {shippingData && shippingData.pinCode}
            </StyledTypography>
            <StyledTypography variant="h6">
            {t('shippingAddress.phoneNumber')} : {shippingData && shippingData.phoneNo}
            </StyledTypography>

            {profile ?
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => setShowTab(!showTab)}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{buttonText}
                </Button>
              </Box>
              :
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <GreenButton
                  onClick={() => navigate("/profile")}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {t('shippingAddress.change')}
                </GreenButton>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {t('shippingAddress.next')}
                </Button>
              </Box>
            }

            <Collapse in={showTab} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  flex: '1 1 auto',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    maxWidth: 550,
                    px: 3,
                    py: '30px',
                    width: '100%'
                  }}
                >
                  <form onSubmit={editHandler}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label={t("shippingAddress.address")}
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label={t("shippingAddress.city")}
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        label={t("shippingAddress.pinCode")}
                        type='number'
                        value={pinCode}
                        error={pinCodeError}
                        helperText={pinCodeError && 'Pin Code should be a 6-digit number'}
                        onChange={(event) => setPinCode(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        key={t('shippingAddress.country')}
                        fullWidth
                        label={t('shippingAddress.country')}
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label={t("shippingAddress.state")}
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        label={t("shippingAddress.phoneNumber")}
                        type='number'
                        value={phoneNo}
                        error={phoneNoError}
                        helperText={phoneNoError && t("shippingAddress.phoneNumberRequired")}
                        onChange={(event) => setPhoneNo(event.target.value)}
                        required
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Stack>
                    <BlueButton
                      fullWidth
                      size="large"
                      sx={{ mt: 3 }}
                      variant="contained"
                      type="submit"
                    >
                      {t('shippingAddress.update')}
                    </BlueButton>
                  </form>
                </Box>
              </Box>
            </Collapse>

          </React.Fragment>
          :
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
            {t('shippingAddress.shipping_address')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label={t('shippingAddress.address')}
                  fullWidth
                  autoComplete="shipping address-line1"
                  variant="standard"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label={t('shippingAddress.city')}
                  fullWidth
                  autoComplete="shipping address-level2"
                  variant="standard"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="pinCode"
                  name="pinCode"
                  label={t('shippingAddress.pinCode')}
                  type='number'
                  fullWidth
                  autoComplete="shipping postal-code"
                  variant="standard"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  error={!!errors.pinCode}
                  helperText={errors.pinCode}
                />
              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label={t('shippingAddress.country')}
                  fullWidth
                  autoComplete="shipping country"
                  variant="standard"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={!!errors.country}
                  helperText={errors.country}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="state"
                  name="state"
                  label={t('shippingAddress.state')}
                  fullWidth
                  variant="standard"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="phoneNo"
                  name="phoneNo"
                  label={t('shippingAddress.phoneNumber')}
                  type='number'
                  fullWidth
                  autoComplete="shipping Phone-number"
                  variant="standard"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {profile ?
                <Button
                  variant="contained"
                  onClick={profileSubmitHandler}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {t('shippingAddress.submit')}
                </Button>
                :
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {t('shippingAddress.next')}
                </Button>
              }
            </Box>
          </React.Fragment>
      }
    </React.Fragment>

  );
}

export default ShippingPage;

const StyledTypography = styled(Typography)`
  margin-bottom: 10px;
`;