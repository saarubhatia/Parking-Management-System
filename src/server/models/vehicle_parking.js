const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//for a specific vehicle
const VehicleParking = new Schema(
  {
    vehicle_parking_id: {type: Number},
    parking_zone_id: {type: String},
    parking_space_id: {type: String},
    booking_date_time: {type: Date},
    release_date_time: {type: Date},
    name:{type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("vehicle_parking", VehicleParking);