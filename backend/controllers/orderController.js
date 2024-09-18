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

        // Find orders with products sold by the seller
        const ordersWithSellerId = await Order.find({
            'orderedProducts.seller': sellerId
        }).select('orderedProducts remarks'); // Select orderedProducts and remarks fields

        if (ordersWithSellerId.length > 0) {
            const orderedProducts = ordersWithSellerId.reduce((accumulator, order) => {
                order.orderedProducts.forEach(product => {
                    const existingProductIndex = accumulator.findIndex(p => p.productName === product.productName);

                    // If product already exists, merge quantities and include remarks
                    if (existingProductIndex !== -1) {
                        accumulator[existingProductIndex].quantity += product.quantity;
                        // Here you can decide how to handle remarks if needed
                        // For now, we're just adding them from the order
                        accumulator[existingProductIndex].remarks = order.remarks || "No remarks";
                    } else {
                        // Add new product and include remarks from the order
                        accumulator.push({
                            ...product.toObject(),
                            remarks: order.remarks || "No remarks" // Add remarks for the order
                        });
                    }
                });
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


module.exports = {
    newOrder,
    getOrderedProductsByCustomer,
    getCompletedOrdersByCustomer,
    getCancelledOrdersByCustomer,
    getOrderedProductsBySeller
};
