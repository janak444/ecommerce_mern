import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { BlueButton, GreenButton } from "../../../utils/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { useNavigate } from "react-router-dom";
import { getSpecificProducts, updateProductRemarks } from "../../../redux/userHandle";

const OutForDeliverySection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, specificProductData, responseSpecificProducts } = useSelector(state => state.user);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [remarks, setRemarks] = useState("");

    // Fetch the specific products when currentUser is available
    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getSpecificProducts(currentUser._id, "getOrderedProductsBySeller"));
        }
    }, [dispatch, currentUser]);

    // Open the dialog to update remarks
    const handleOpenDialog = (product) => {
        setSelectedProduct(product);
        setRemarks(product.remarks || ""); // Load the existing remarks or empty if not present
        setOpenDialog(true);
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
        setRemarks("");
    };

    // Save the updated remarks and dispatch the action
    const handleSaveRemarks = () => {
        if (selectedProduct) {
            dispatch(updateProductRemarks(selectedProduct.productID, remarks)); 
        }
        handleCloseDialog(); // Close dialog after saving remarks
    };

    // Define columns for product table
    const productsColumns = [
        { id: 'name', label: 'Product Name', minWidth: 170 },
        { id: 'quantity', label: 'Product Quantity', minWidth: 100 },
        { id: 'category', label: 'Product Category', minWidth: 100 },
        { id: 'subcategory', label: 'Product SubCategory', minWidth: 100 },
        { id: 'remarks', label: 'Remarks', minWidth: 200 }, 
    ];

    // Map over specificProductData to generate rows for the table
    const productsRows = Array.isArray(specificProductData) && specificProductData.length > 0
        ? specificProductData.map((product) => ({
            name: product.productName,
            quantity: product.quantity,
            category: product.category,
            subcategory: product.subcategory,
            remarks: product.remarks || "No remarks", // Default to "No remarks" if empty
            id: product.productName,
            productID: product._id,
        }))
        : [];

    // Button component for each row (View and Update Remarks)
    const ProductsButtonHaver = ({ row }) => {
        return (
            <>
                <BlueButton
                    onClick={() => navigate("/Seller/orders/product/" + row.productID)}
                >
                    View Product
                </BlueButton>
                <GreenButton
                    onClick={() => handleOpenDialog(row)} 
                >
                    Update Remarks
                </GreenButton>
            </>
        );
    };

    return (
        <>
            {responseSpecificProducts ?
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Seller/addproduct")}
                    >
                        Add Products
                    </GreenButton>
                </Box>
                :
                <>
                    <Typography variant="h5" gutterBottom>
                        Products List:
                    </Typography>

                    <TableTemplate buttonHaver={ProductsButtonHaver} columns={productsColumns} rows={productsRows} />
                </>
            }

            {/* Dialog for updating remarks */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Update Remarks for {selectedProduct?.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Remarks"
                        fullWidth
                        multiline
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)} // Update remarks state on input change
                    />
                </DialogContent>
                <DialogActions>
                    <BlueButton onClick={handleCloseDialog}>
                        Cancel
                    </BlueButton>
                    <GreenButton onClick={handleSaveRemarks}>
                        Save Remarks
                    </GreenButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OutForDeliverySection;
