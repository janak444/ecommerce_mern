import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, TextField } from '@mui/material';
import Popup from '../../../components/Popup';
import { BlueButton } from '../../../utils/buttonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userHandle';
import styled from 'styled-components';
import altImage from "../../../assets/altimg.png";

const AddProduct = () => {
  const dispatch = useDispatch();

  const { currentUser, status, response, error } = useSelector(state => state.user);

  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const seller = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    category,
    description,
    tagline,
    seller
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result); // This will set the image as a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff("ProductCreate", fields));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, response, error]);

  return (
    <>
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
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              {
                productImage
                  ? <ProductImage src={productImage} alt="Product" />
                  : <ProductImage src={altImage} alt="Alternative" />
              }
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                {/* Input field for image upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
                <TextField
                  fullWidth
                  label="Product Name"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="MRP"
                  value={mrp}
                  onChange={(event) => setMrp(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Cost"
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Discount Percent"
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Subcategory"
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Tagline"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
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
                disabled={loader}
              >
                {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
              </BlueButton>
            </form>
          </div>
        </Box>
      </Box>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddProduct;

// Styled component for product image
const ProductImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 8px;
`;
