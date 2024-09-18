
//import mongoose and models
var mongoose = require('mongoose')

var Model = require("../models/index");

//bluebird for promise
const promise = require('bluebird');

module.exports = {
    // Job seeker Pin

    createPigeon: async (data) => {
        console.log("createPigeonHelperFunction is called");
        const Pigeon= new Model.Competation(data)
        await Pigeon.save()
        return Pigeon

    },
    createPigeon1: async (data) => {
        console.log("createPigeonHelperFunction is called");
        const Pigeon= new Model.Pigeon(data)
        await Pigeon.save()
        return Pigeon

    },
    getPinWithFullDetails: async (sortProperty, sortOrder = -1, offset = 0, limit = 100000, query) => {
        console.log("getPigeonModel Function called")

        const Pins = await Model.Pigeon.find().populate('userId')
            .sort({ [sortProperty]: sortOrder })
            .skip(offset)
            .limit(limit);

        const PinSize = Pins.length

        return {
            Pins: Pins,
            count: PinSize,
            offset: offset,
            limit: limit
        };

    },
    updatePin: async (data) => {
        console.log("updatePigeonHelperFunction is called");

        const result = await promise.all([Model.Pigeon.findOneAndUpdate({ _id: data.PinId }, data, { new: true })])
        return result;

    },


};
