// const mongoose = require("mongoose");

// const adminSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: "Admin"
//     },
//     permissions: [{
//         type: String,
//         enum: ["acceptSeller", "acceptCustomer", "manageProducts", "manageOrders"],
//     }],
//     dateCreated: {
//         type: Date,
//         default: Date.now,
//     }
// });

// module.exports = mongoose.model("admin", adminSchema);
