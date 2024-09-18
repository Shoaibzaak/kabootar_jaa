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
router.route("/createCompetition").post(
  upload.fields([
    {
      name: "pictures",
      maxCount: 10,
    },
  ]),
  // Authentication.UserAuth,
  Controller.PigeonsController.createPigeon);

  router.route("/createPigeon").post(
    Controller.PigeonsController.createPigeon1);

//update Pigeon
router.route("/updateCompetation").put(
  // Authentication.UserAuth,
  upload.fields([
    {
      name: "pictures",
      maxCount: 10,
    },
  ]),
  Controller.PigeonsController.updatePigeon);

//delete Pigeon
router.route("/deleteCompetation/:id").delete(
  // Authentication.UserAuth,
  Controller.PigeonsController.declinePigeon);


// get Pigeon by id
router.route("/findCompetationById/:id").get(
  // Authentication.UserAuth,
  Controller.PigeonsController.getPigeonUser);

  // get all  Pigeons with details
router.route("/getAllCompetations").get(
  // Authentication.UserAuth,
  Controller.PigeonsController.getAllPigeonUsers);



module.exports = router;



