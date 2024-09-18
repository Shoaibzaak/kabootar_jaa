const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pigeonModel = new Schema(
  {
    name: {
      type: String,
      required:true
    },  
    
  },

  {
    timestamps: true,
    strict: true,
  }
);

pigeonModel.set("toJSON", {
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
  },
});

const pigeon = mongoose.model("pigeon", pigeonModel);
module.exports = pigeon;
