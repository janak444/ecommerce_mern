const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.ObjectId,
            ref: "customer",
            required: true,
        },
        shippingData: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            pinCode: {
                type: Number,
                required: true,
            },
            phoneNo: {
                type: Number,
                required: true,
            },
        },
        orderedProducts: [{
            productName: {
                type: String
            },
            price: {
                mrp: {
                    type: Number
                },
                cost: {
                    type: Number
                },
                discountPercent: {
                    type: Number
                }
            },
            subcategory: {
                type: String
            },
            productImage: {
                type: String
            },
            category: {
                type: String
            },
            description: {
                type: String
            },
            tagline: {
                type: String
            },
            quantity: {
                type: Number
            },
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'seller'
            },
        }],
        paymentInfo: {
            id: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                required: true,
            },
        },
        paymentMethod: {
            type: String, 
            required: true,
        },
        remarks: {
            type: String, 
            default: null,
        },
        paidAt: {
            type: Date,
        },
        productsQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        orderStatus: {
            type: String,
            required: true,
            default: "Pending",  // Status can be "Pending", "Completed", "Cancelled", etc.
        },
        isCompleted: {
            type: Boolean,
            default: false,  // To track if the order is completed
        },
        isCancelled: {
            type: Boolean,
            default: false,  // To track if the order is cancelled
        },
        deliveredAt: Date,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

module.exports = mongoose.model("order", orderSchema);
