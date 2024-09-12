const bcrypt = require('bcryptjs');
const Seller = require('../models/sellerSchema.js');
const { createNewToken } = require('../utils/token.js');

const sellerRegister = async (req, res) => {
    try {
        // Generate a salt and hash a predefined password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash("customPassword123", salt); 

        // Prepare custom seller data
        const customSellerData = {
            name: "Custom Seller",        
            email: "seller@gmail.com", 
            shopName: "pooja Shop",      
            password: hashedPass,        
            role: "Seller"               
        };

        // Check if email or shopName already exists in the database
        const existingSellerByEmail = await Seller.findOne({ email: customSellerData.email });
        const existingShop = await Seller.findOne({ shopName: customSellerData.shopName });

        if (existingSellerByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        if (existingShop) {
            return res.send({ message: 'Shop name already exists' });
        }

        // Create new seller with the custom data
        const seller = new Seller(customSellerData);
        let result = await seller.save();
        result.password = undefined; // Hide password from response

        // Create a token for the newly registered seller
        const token = createNewToken(result._id);

        // Include the token in the response
        const response = {
            ...result._doc,
            token: token
        };

        // Send the response
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err });
    }
};

const sellerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let seller = await Seller.findOne({ email: req.body.email });
        if (seller) {
            const validated = await bcrypt.compare(req.body.password, seller.password);
            if (validated) {
                seller.password = undefined;

                const token = createNewToken(seller._id)

                seller = {
                    ...seller._doc,
                    token: token
                };

                res.send(seller);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

module.exports = { sellerRegister, sellerLogIn };
