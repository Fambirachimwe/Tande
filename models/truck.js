
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const truckSchema = new Schema({
    owner_id: { type: String, ref: 'User', required: true },
    license_plate: { type: String, required: true, unique: true },
    insureranceInfo: String,
    capacity: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    location: { type: String, required: true },
    hasLoad: { type: Boolean, default: false },
    ratePerKm: Number,
    rating: Number

});

const Truck = mongoose.model('Truck', truckSchema);

export default Truck;
