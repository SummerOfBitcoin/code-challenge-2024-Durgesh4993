// Transaction.js
class Transaction {
    constructor(sender, receiver, amount, signature) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.signature = signature;
    }
}

module.exports = Transaction;
