import Payment from "../models/payment";
import express from 'express';

const router = express.Router();

router.post('/payment', async (req, res) => {
    const { load, amount, method } = req.body;
    try {
        const payment = new Payment({
            load,
            amount,
            method,
        });
        await payment.save();
        res.status(201).send(payment);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get payment by id
router.get('/payment/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const payment = await Payment.findById(_id);
        if (!payment) {
            return res.status(404).send();
        }
        res.send(payment);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get payment by paymentRef
router.get('/payment/paymentRef/:paymentRef', async (req, res) => {
    const { paymentRef } = req.params;
    try {
        const payment = await Payment.findOne({ paymentRef });
        if (!payment) {
            return res.status(404).send();
        }
        res.send(payment);
    } catch (error) {
        res.status(500).send(error);
    }
});



export default router;