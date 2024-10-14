import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { BlueButton, GreenButton, RedButton } from "../../../utils/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { useNavigate } from "react-router-dom";
import { getSpecificProducts, updateProductStatus } from "../../../redux/userHandle";

const CancelledOrderSection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, specificProductData, responseSpecificProducts } = useSelector(state => state.user);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [remarks, setRemarks] = useState("");
    
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);

    // Fetch the specific products when currentUser is available
    useEffect(() => {
        if (currentUser && currentUser._id) {
            dispatch(getSpecificProducts(currentUser._id, "getOrderedProductsBySeller"));
        }
    }, [dispatch, currentUser]);

    // Open the dialog to update remarks
    const handleOpenDialog = (product) => {
        setSelectedProduct(product);
        setRemarks(product.remarks || "");
        setOpenDialog(true);
    };

    // Update product status (Complete, Cancel)
    const handleUpdateStatus = (orderId, action) => {
        if (!orderId || !action) {
            console.error("Order ID and action are required");
            return;
        }
    
        if (currentUser && currentUser._id) {
            dispatch(updateProductStatus(currentUser._id, orderId, action))
                .catch(error => console.error("Error updating product status:", error));
        } else {
            console.error("Current user (seller) ID not found.");
        }
    };

    // Handle view customer details
    const handleViewCustomerDetails = (row) => {
        const customerInfo = {
            name: row.customer || "N/A",  // Adjusted to reference customer name correctly
            email: row.customerEmail || "N/A",
            shippingAddress: row.shippingAddress || "N/A",
            phone: row.phone || "N/A",
        };
        setCustomerDetails(customerInfo);
        setOpenCustomerDialog(true);
    };

    // Close customer dialog
    const handleCloseCustomerDialog = () => {
        setOpenCustomerDialog(false);
        setCustomerDetails(null);
    };

    // Define columns for product table
    const productsColumns = [
        { id: 'customer', label: 'Customer', minWidth: 170 },
        { id: 'name', label: 'Product Name', minWidth: 170 },
        { id: 'quantity', label: 'Product Quantity', minWidth: 100 },
        { id: 'category', label: 'Product Category', minWidth: 100 },
        { id: 'subcategory', label: 'Product SubCategory', minWidth: 100 },
        { id: 'remarks', label: 'Remarks', minWidth: 200 }, 
    ];

    // Map over specificProductData to generate rows for the table
    const productsRows = Array.isArray(specificProductData) && specificProductData.length > 0
    ? specificProductData.filter(order => order.isCancelled).flatMap(order => 
        order.products.map(product => ({
            key: `${order.orderId}-${product.productID}`,  // Unique key based on orderId and productId
            customer: order.customer.name || "Unknown customer",
            name: product.productName,
            quantity: product.quantity,
            category: product.category,
            subcategory: product.subcategory,
            remarks: order.remarks || "No remarks", 
            productID: product.productID || "Unknown product ID",
            orderId: order.orderId,
            orderStatus: order.orderStatus,
            isCompleted: order.isCompleted,
            isCancelled: order.isCancelled,
            customerName: order.customer.name, // Ensure this field exists in the response
            customerEmail: order.customer.email, // Ensure this field exists in the response
            shippingAddress: order.shippingData.address, // Ensure this field exists in the response
            phone: order.shippingData.phoneNo
        }))
    )
    : [];


    // Button component for each row (View Product, View Customer, Update Remarks, Complete, Cancel)
    const ProductsButtonHaver = ({ row }) => {
        return (
            <>
                <BlueButton
                    onClick={() => navigate("/Seller/orders/product/" + row.productID)}
                >
                    View Product
                </BlueButton>
                <BlueButton
                    onClick={() => handleViewCustomerDetails(row)}
                    key={`${row.productID}-viewCustomer`}
                >
                    View Customer
                </BlueButton>
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

            {/* Dialog for viewing customer details */}
            <Dialog open={openCustomerDialog} onClose={handleCloseCustomerDialog}>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent>
                    {customerDetails && (
                        <>
                            <Typography variant="body1"><strong>Name:</strong> {customerDetails.name}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {customerDetails.email}</Typography>
                            <Typography variant="body1"><strong>Phone:</strong> {customerDetails.phone}</Typography>
                            <Typography variant="body1"><strong>Shipping Address:</strong> {customerDetails.shippingAddress}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <RedButton onClick={handleCloseCustomerDialog}>Close</RedButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CancelledOrderSection;
