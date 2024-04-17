// MiningAlgorithm.js
const crypto = require('crypto');

function mineBlock(block, difficultyTarget) {
    let nonce = 0;
    let blockHash = '';
    const blockHeaderString = JSON.stringify(block.header);
    const target = BigInt('0x' + difficultyTarget);

    do {
        block.header.nonce = nonce;
        blockHash = crypto.createHash('sha256').update(blockHeaderString).digest('hex');
        nonce++;
    } while (BigInt('0x' + blockHash) >= target);

    return blockHash;
}

module.exports = mineBlock;
