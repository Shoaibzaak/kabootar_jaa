const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const competationModel = new Schema(
  {
    competitionName: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    date: {
      type: String,
    },
    startTime: {
      type: String, // Use String for flexible time formats or Date for exact timestamp
    },
    endTime: {
      type: String, // Same as above, you can use Date if needed
     
    },
    pictures: {
      type: [String], // Array of strings (URLs or paths to the images)
      default: [],
    },
    pegions:{
      type:Number,
      default:""
    }
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Remove __v from the returned JSON
competationModel.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
  },
});

const Competation = mongoose.model("Competation", competationModel);
module.exports = Competation;
