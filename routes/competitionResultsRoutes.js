const express = require("express");
const Controller = require("../controllers/index");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Authentication = require("../policy/index");

const userStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFileFilter = function (req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedImageTypes = [".png", ".jpg", ".gif", ".jpeg"];
  if (allowedImageTypes.includes(ext)) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};


const upload = multer({
  storage: userStorage,
  // fileFilter: function (req, file, callback) {
  //   if (file.fieldname === "image") {
  //     imageFileFilter(req, file, callback);
  //   }  
  //   else {
  //     callback(new Error("Invalid fieldname"));
  //   }
  // },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
//post custom Pigeon 
router.route("/createCompetitionResult").post(
  upload.fields([
    {
      name: "pictures",
      maxCount: 10,
    },
  ]),
  // Authentication.UserAuth,
  Controller.CompetationResultsController.createResults);

//update Pigeon
router.route("/updateCompetationResult").put(
  // Authentication.UserAuth,
  upload.fields([
    {
      name: "pictures",
      maxCount: 10,
    },
  ]),
  Controller.CompetationResultsController.updateResults);

//delete Pigeon
router.route("/deleteCompetationResult/:id").delete(
  // Authentication.UserAuth,
  Controller.CompetationResultsController.declineResults);


// get Pigeon by id
router.route("/findCompetationResultById/:id").get(
  // Authentication.UserAuth,
  Controller.CompetationResultsController.getResultsUser);

  // get all  Pigeons with details
router.route("/getAllCompetationResults").get(
  // Authentication.UserAuth,
  Controller.CompetationResultsController.getAllResultsUsers);



module.exports = router;



