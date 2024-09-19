const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_N8bwtya9NU0jFB5ieNazsfbJ");
const Model = require("../models/index");
const Validation = require("../validations/validation");
const Message = require("../Message");
const Services = require("../services");
const HTTPError = require("../utils/CustomError");
const responseHelper = require("../helper/response.helper");
const ResultsHelper = require("../helper/result.helper");
const Status = require("../status");
const cloudUpload = require("../cloudinary");
const catchAsync = require("../utils/catchAsync");

module.exports = {

    // Retrieve Results user by ResultsId
getResultsUser: async (req, res) => {
    console.log("findResultsById is called");
    try {
        // Extract the Results ID from the request parameters
        var ResultsId = req.params.id;
        console.log(ResultsId);

        // Find the Results user by ID using the Results model
        var result = await Model.CompetationResults.findById(ResultsId);

        // Check if a Results user was found
        var message = result ? "ResultsId found successfully" : "ResultsId does not exist.";

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
            message: "An error occurred while retrieving the Results user.",
            error: error.message || error,
        });
    }
},


    // Create a new Results
    createResults: catchAsync(async (req, res, next) => {
        console.log("createCompetation is called");
        try {
            var ResultsData = req.body;
            if (req.files && req.files.pictures) {
                const image = req.files.pictures[0];
                console.log(image,"image files");
                const imagePath = image.path; // Get the file path
                const imageUrl = await cloudUpload.cloudinaryUpload(imagePath);
                console.log(imageUrl,"imageUrl")
                ResultsData.pictures= imageUrl;
            }
            var result = await ResultsHelper.createResults(ResultsData);

            var message = "createCompetation created successfully";
            if (result == null) {
                message = "createCompetation does not exist.";
            }

            return responseHelper.success(res, ResultsData, message);
        } catch (error) {
            responseHelper.requestfailure(res, error);
        }
    }),


    // Get all Results users with full details
    getAllResultsUsers: catchAsync(async (req, res, next) => {
        console.log("Resultsdetails is called");
      try {
            // var ResultsData = req.body;

            // var result = await ResultsHelper.getResultsWithFullDetails(ResultsData.sortproperty, ResultsData.sortorder, ResultsData.offset, ResultsData.limit, ResultsData.query);
            // const pageNumber = parseInt(req.query.pageNumber) || 0;
            // const limit = parseInt(req.query.limit) || 10;
            var message = "Resultsdetails found successfully";
            var Families = await Model.CompetationResults.find()
                // .skip((pageNumber * limit) - limit)
                // .limit(limit)
                // .sort("-_id")
                // ;

            const ResultsSize = Families.length
            const result = {
                Results: Families,
                count: ResultsSize,
            }
            if (result == null) {
                message = "Resultsdetails does not exist.";
            }
            return responseHelper.success(res, result, message);
        } catch (error) {
            responseHelper.requestfailure(res, error);
        }
    }),

// Update a Results user
updateResults: async (req, res) => {
    // Get the Results user data from the request body
    var ResultsUserData = req.body;

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
            ResultsUserData.pictures = imageUrls;

            // If you want to append the new pictures, retrieve the existing pictures and concatenate
            // const existingResults = await Model.Competation.findById(ResultsUserData.ResultsId);
            // ResultsUserData.pictures = [...existingResults.pictures, ...imageUrls];
        }

        // Find the Results user and update with the new data
        var result = await Model.CompetationResults.findOneAndUpdate(
            { _id: ResultsUserData.ResultsId }, // Find by Results ID
            ResultsUserData, // Update data
            { new: true } // Return the updated document
        );

        // If no Results user is found
        if (!result) {
            return res.status(404).json({
                status:"false",
                message: "Results user not found",
            });
        }

        // Success response
        return res.status(200).json({
            status:"Success",
            message: "Results status updated successfully",
            result,
        });

    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        return res.status(500).json({
            status:"false",
            message: "Internal server error",
            error: err.message || err,
        });
    }
},

// Delete a Results user
declineResults: async (req, res) => {
    var ResultsId = req.params.id;
    try {
        const ResultsUser = await Model.CompetationResults.findOneAndDelete({ _id: ResultsId });
        if (!ResultsUser) {
            return res.status(404).json({
                status:"false",
                message: "Results user not found",
            });
        }
        var message = "Results user deleted successfully";
        return res.status(200).json({
            status:"Success",
            message,
            ResultsUser,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            status:"false",
            message: "Internal server error",
            error: err.message || err,
        });
    }
},

};


