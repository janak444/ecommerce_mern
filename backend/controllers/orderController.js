const Order = require('../models/orderSchema.js');

// Create a new order with payment method and remarks handling
const newOrder = async (req, res) => {
    try {
        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paymentMethod, 
            remarks, 
            productsQuantity,
            totalPrice,
        } = req.body;

        // Calculate delivery charge if total price is less than 1000
        let finalTotalPrice = totalPrice;
        const DELIVERY_CHARGE = 50;
        if (totalPrice < 1000) {
            finalTotalPrice += DELIVERY_CHARGE;
        }

        // Create the new order in the database
        const order = await Order.create({
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paymentMethod, 
            remarks: paymentMethod === 'pre_payment' ? remarks : null, 
            paidAt: paymentMethod === 'pre_payment' ? Date.now() : null, 
            productsQuantity,
            totalPrice: finalTotalPrice,
            orderStatus: paymentMethod === 'pre_payment' ? 'Pending' : 'Processing', 
        });

        return res.send(order);

    } catch (err) {
        res.status(500).json(err);
    }
};

// Get ordered products by customer ID
const getOrderedProductsByCustomer = async (req, res) => {
    try {
        let orders = await Order.find({ buyer: req.params.id });

        if (orders.length > 0) {
            const orderedProducts = orders.reduce((accumulator, order) => {
                accumulator.push(...order.orderedProducts);
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get completed orders by customer ID
const getCompletedOrdersByCustomer = async (req, res) => {
    try {
        const completedOrders = await Order.find({
            buyer: req.params.id,
            isCompleted: true
        });

        if (completedOrders.length > 0) {
            res.send(completedOrders);
        } else {
            res.status(404).json({ message: "No completed orders found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get cancelled orders by customer ID
const getCancelledOrdersByCustomer = async (req, res) => {
    try {
        const cancelledOrders = await Order.find({
            buyer: req.params.id,
            isCancelled: true
        });

        if (cancelledOrders.length > 0) {
            res.send(cancelledOrders);
        } else {
            res.status(404).json({ message: "No cancelled orders found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get ordered products by seller ID, merging quantities of the same products
const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // Fetch orders for the given seller ID
        const ordersWithSellerId = await Order.find({
            'orderedProducts.seller': sellerId
        })
        .populate('buyer', 'name email') // Populate buyer information (name and email)
        .select('orderedProducts remarks buyer orderStatus isCompleted isCancelled shippingData'); 

        // If orders are found, map and format them for the response
        if (ordersWithSellerId.length > 0) {
            const orderDetails = ordersWithSellerId.map(order => ({
                orderId: order._id, // Order ID for referencing in the frontend
                customer: {
                    name: order.buyer ? order.buyer.name : "Unknown customer", // Display buyer's name
                    email: order.buyer ? order.buyer.email : "No email", // Display buyer's email
                },
                shippingData: order.shippingData ? { // Shipping details
                    address: order.shippingData.address,
                    city: order.shippingData.city,
                    state: order.shippingData.state,
                    country: order.shippingData.country,
                    pinCode: order.shippingData.pinCode,
                    phoneNo: order.shippingData.phoneNo
                } : "No shipping data",
                products: order.orderedProducts.map(product => ({
                    productName: product.productName,
                    price: product.price, // Price details (mrp, cost, discount)
                    subcategory: product.subcategory,
                    productImage: product.productImage,
                    category: product.category,
                    description: product.description,
                    tagline: product.tagline,
                    quantity: product.quantity,
                    seller: product.seller, // Seller reference (already filtered by this seller)
                    productID: product._id 
                })),
                remarks: order.remarks || "No remarks", // Order remarks
                orderStatus: order.orderStatus,  // Current order status
                isCompleted: order.isCompleted,  // Completion flag
                isCancelled: order.isCancelled   // Cancellation flag
            }));

            // Send the formatted list of orders with their details
            return res.status(200).json(orderDetails);
        } else {
            // If no orders are found, return a 404 error
            return res.status(404).json({ message: "No orders found for this seller" });
        }
    } catch (err) {
        // Handle server errors
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const { orderId, action } = req.body; // Extract orderId and action from request body

        // Ensure both orderId and action are provided
        if (!orderId || !action) {
            return res.status(400).json({ message: "Order ID and action (complete/cancel) are required" });
        }

        // Prepare update fields based on action
        const updateFields = {};
        if (action === 'complete') {
            updateFields.isCompleted = true;
            updateFields.orderStatus = "Completed";
            updateFields.isCancelled = false;
        } else if (action === 'cancel') {
            updateFields.isCancelled = true;
            updateFields.orderStatus = "Cancelled";
            updateFields.isCompleted =false;
        } else {
            return res.status(400).json({ message: "Invalid action. Action must be 'complete' or 'cancel'" });
        }

        // Update the order based on orderId
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: updateFields },
            { new: true, runValidators: true } // Return updated document
        );

        // Check if order was found and updated
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        // Respond with success and updated order
        res.status(200).json({
            success: true,
            message: `Order status updated to ${action}`,
            updatedOrder,
        });
    } catch (err) {
        console.error("Error updating order status: ", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


module.exports = {
    newOrder,
    getOrderedProductsByCustomer,
    getCompletedOrdersByCustomer,
    getCancelledOrdersByCustomer,
    getOrderedProductsBySeller,
    updateOrderStatus
};
