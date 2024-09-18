
//import mongoose and models
var mongoose = require('mongoose')

var Model = require("../models/index");

//bluebird for promise


module.exports = {
    // Job seeker Pin

    createResults: async (data) => {
        console.log("createPigeonHelperFunction is called");
        const Pigeon= new Model.CompetationResults(data)
        await Pigeon.save()
        return Pigeon

    },
   


};
