import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    uniqueServiceNumber: {
        type: Number,
        required: true
    },
    userName:
    {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        required: false
    },
    credentials: {
        type: String
    },
    paymentInitiated:
    {
        type: Boolean,
        default: false
    },
    paymentConfirmationStatus:
    {
        type: String,
        default: "NOT INITIATED PAYMENT"
    },

    billUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    billMonth: {
        type: String,
        required: true
    },
    billYear: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Bill = mongoose.models?.Bill || mongoose.model("Bill", billSchema);