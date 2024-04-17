// BlockHeader.js
class BlockHeader {
    constructor(version, previousBlockHash, merkleRoot, timestamp, difficultyTarget, nonce) {
        this.version = version;
        this.previousBlockHash = previousBlockHash;
        this.merkleRoot = merkleRoot;
        this.timestamp = timestamp;
        this.difficultyTarget = difficultyTarget;
        this.nonce = nonce;
    }
}

module.exports = BlockHeader;