const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['credit', 'debit'], 
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
