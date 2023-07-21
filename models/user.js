import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//  user can be a shipper, driver, administrator

const userSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['shipper', 'truckOwner'], required: true, default: "shipper" },


});

const User = mongoose.model('User', userSchema);

export default User;

