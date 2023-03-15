const express = require("express");
const router = express.Router();
const { courseReviewModel } = require("../models/models");
require("dotenv").config();

const pwd = process.env.ADMIN_PASSWORD;

router.post("/authenAdmin", async (req, res) => {
    if (req.body.password && req.body.password === pwd) {
        res.send( {isAdmin : true} );
    } else {
        res.send( {isAdmin : false} );
    }
});

router.get("/pendingReviews", async (req, res) => {
    try {
      const courseReviews = await courseReviewModel.find({status: 0});
      res.status(200).json(courseReviews);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  router.post("/approve/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const updatedRecord = await courseReviewModel.findByIdAndUpdate(id, { status: 1 }, { new: true });
      res.status(200).json(updatedRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error approving course review" });
    }
  });
  

  router.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Find the document by id and delete it
        const deletedDoc = await courseReviewModel.findByIdAndDelete(id);
    
        // If the document was not found, return a 404 response
        if (!deletedDoc) {
          return res.status(404).json({ error: "Document not found" });
        }
    
        // Return a success response
        return res.status(200).json({ message: "Document deleted successfully" });
      } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
});

module.exports = router;