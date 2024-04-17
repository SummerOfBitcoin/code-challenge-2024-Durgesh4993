// CoinbaseTransaction.js
class CoinbaseTransaction {
    constructor(minerAddress, feesCollected) {
        this.minerAddress = minerAddress;
        this.feesCollected = feesCollected;
    }
}

module.exports = CoinbaseTransaction;
