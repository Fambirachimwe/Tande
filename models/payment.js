import mongoose from 'moongose';
import { nanoid } from 'nanoid';

const Schema = mongoose.Schema;


const paymentSchema = new Schema({
    load: { type: String, ref: 'Load', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['ecocash', 'onemoney', 'bank transfer', 'visa', 'mastercard'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentRef: { type: String, default: nanoid(6) }  // this is the referrence that must be sent to the customer after the payment has been done
})

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

