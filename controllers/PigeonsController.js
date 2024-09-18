const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_N8bwtya9NU0jFB5ieNazsfbJ");
const Model = require("../models/index");
const Validation = require("../validations/validation");
const Message = require("../Message");
const Services = require("../services");
const HTTPError = require("../utils/CustomError");
const responseHelper = require("../helper/response.helper");
const PigeonHelper = require("../helper/pigeon.helper");
const Status = require("../status");
const cloudUpload = require("../cloudinary");
const catchAsync = require("../utils/catchAsync");

module.exports = {

    // Retrieve Pigeon user by PigeonId
getPigeonUser: async (req, res) => {
    console.log("findPigeonById is called");
    try {
        // Extract the Pigeon ID from the request parameters
        var PigeonId = req.params.id;
        console.log(PigeonId);

        // Find the Pigeon user by ID using the Pigeon model
        var result = await Model.Competation.findById(PigeonId);

        // Check if a Pigeon user was found
        var message = result ? "PigeonId found successfully" : "PigeonId does not exist.";

        // Return the result along with a success message
        return res.status(result ? 200 : 404).json({
            success: true,
            message: message,
            data: result,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging

        // Handle errors and send a failure response
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the Pigeon user.",
            error: error.message || error,
        });
    }
},


    // Create a new Pigeon
    createPigeon: catchAsync(async (req, res, next) => {
        console.log("createCompetation is called");
        try {
            var PigeonData = req.body;
            if (req.files && req.files.pictures) {
                const image = req.files.pictures[0];
                console.log(image,"image files");
                const imagePath = image.path; // Get the file path
                const imageUrl = await cloudUpload.cloudinaryUpload(imagePath);
                console.log(imageUrl,"imageUrl")
                PigeonData.pictures= imageUrl;
            }
            var result = await PigeonHelper.createPigeon(PigeonData);

            var message = "createCompetation created successfully";
            if (result == null) {
                message = "createCompetation does not exist.";
            }

            return responseHelper.success(res, PigeonData, message);
        } catch (error) {
            responseHelper.requestfailure(res, error);
        }
    }),

    createPigeon1: catchAsync(async (req, res, next) => {
        console.log("createPigeon is called");
        try {
            var PigeonData = req.body;
                      var result = await PigeonHelper.createPigeon1(PigeonData);

            var message = "Pigeon created successfully";
            if (result == null) {
                message = "Pigeon does not exist.";
            }
       
            return responseHelper.success(res, PigeonData, message);
        } catch (error) {
            responseHelper.requestfailure(res, error);
        }
    }),


    // Get all Pigeon users with full details
    getAllPigeonUsers: catchAsync(async (req, res, next) => {
        console.log("Pigeondetails is called");
      try {
            // var PigeonData = req.body;

            // var result = await PigeonHelper.getPigeonWithFullDetails(PigeonData.sortproperty, PigeonData.sortorder, PigeonData.offset, PigeonData.limit, PigeonData.query);
            // const pageNumber = parseInt(req.query.pageNumber) || 0;
            // const limit = parseInt(req.query.limit) || 10;
            var message = "Pigeondetails found successfully";
            var Families = await Model.Competation.find()
                // .skip((pageNumber * limit) - limit)
                // .limit(limit)
                // .sort("-_id")
                // ;

            const PigeonSize = Families.length
            const result = {
                Pigeon: Families,
                count: PigeonSize,
            }
            if (result == null) {
                message = "Pigeondetails does not exist.";
            }
            return responseHelper.success(res, result, message);
        } catch (error) {
            responseHelper.requestfailure(res, error);
        }
    }),

// Update a Pigeon user
updatePigeon: async (req, res) => {
    // Get the Pigeon user data from the request body
    var PigeonUserData = req.body;

    try {
        // Check if there are any pictures uploaded in the request
        if (req.files && req.files.pictures) {
            const uploadedPictures = req.files.pictures; // Array of pictures
            const imageUrls = [];

            // Loop through each uploaded image and upload it to Cloudinary
            for (const image of uploadedPictures) {
                const imagePath = image.path; // Get the file path
                const imageUrl = await cloudUpload.cloudinaryUpload(imagePath); // Upload and get the URL
                imageUrls.push(imageUrl); // Collect the image URL
            }

            // Decide if you want to replace or append pictures
            // Replace existing pictures
            PigeonUserData.pictures = imageUrls;

            // If you want to append the new pictures, retrieve the existing pictures and concatenate
            // const existingPigeon = await Model.Competation.findById(PigeonUserData.PigeonId);
            // PigeonUserData.pictures = [...existingPigeon.pictures, ...imageUrls];
        }

        // Find the Pigeon user and update with the new data
        var result = await Model.Competation.findOneAndUpdate(
            { _id: PigeonUserData.PigeonId }, // Find by Pigeon ID
            PigeonUserData, // Update data
            { new: true } // Return the updated document
        );

        // If no pigeon user is found
        if (!result) {
            return res.status(404).json({
                message: "Pigeon user not found",
            });
        }

        // Success response
        return res.status(200).json({
            message: "Pigeon status updated successfully",
            result,
        });

    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message || err,
        });
    }
},

// Delete a Pigeon user
declinePigeon: async (req, res) => {
    var PigeonId = req.params.id;
    try {
        const PigeonUser = await Model.Competation.findOneAndDelete({ _id: PigeonId });
        if (!PigeonUser) {
            return res.status(404).json({
                message: "Pigeon user not found",
            });
        }
        var message = "Pigeon user deleted successfully";
        return res.status(200).json({
            message,
            PigeonUser,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            message: "Internal server error",
            error: err.message || err,
        });
    }
},

};


