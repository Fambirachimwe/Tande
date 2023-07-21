import mongoose from 'mongoose';

const Schema = mongoose.Schema

const loadSchema = new Schema({

    pickupLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    dropOffLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    price: Number,
    weight: { type: Number, required: true },
    volume: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['available', 'in transit', 'delivered'], default: 'available' },
    shipper: { type: String, ref: 'User', required: true },
    contents: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    comments: [{
        user_id: { type: String, ref: 'User' },
        content: { type: String },
        votes: { type: Number, default: 0 }
    }],

    accepted: { type: Boolean, default: false }, // apa panye nyaya apa 
    acceptedAt: { type: Date },  //
    driver: { type: String, ref: 'User' }

})

loadSchema.index({ pickupLocation: '2dsphere' });  // this index is used for searching nearby loads 

loadSchema.pre('save', function (next) {
    if (this.isModified('accepted') && this.accepted === true) {
        this.acceptedAt = new Date();
    }
    next();
});

const Load = mongoose.model('Load', loadSchema);

export default Load;
