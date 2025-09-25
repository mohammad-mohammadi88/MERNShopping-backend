import express from "express";
import userModel from "./user.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const allUsers = await userModel.find();
    res.json(allUsers);
});
router.post("/", async (req, res) => {
    const mobile = "09146360528";
    const firstName = "mohammad";
    const lastName = "mohammadi";
    const newUser = new userModel({
        firstName,
        lastName,
        email: "mohammaddev09@gmail.com",
        mobile,
    });
    newUser.addresses.push({
        title: "urmia",
        state: "urmia",
        city: "urmia",
        mobile,
        address: "iran urmia",
        zipCode: "142415611",
    });
    await newUser.save();

    res.json({ newUser });
});

export default router;
