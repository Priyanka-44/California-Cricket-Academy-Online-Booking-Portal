const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();


// CREATE MESSAGE

router.post("/", async (req, res) => {

  try {

    const { name, email, message } = req.body;

    const newMessage = new Contact({
      name,
      email,
      message
    });

    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to sending message"
    });

  }

});


module.exports = router;