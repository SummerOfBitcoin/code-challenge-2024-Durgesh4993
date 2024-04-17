// main.js
const fs = require('fs');
const BlockHeader = require('./BlockHeader');
const Transaction = require('./Transaction');
const CoinbaseTransaction = require('./CoinbaseTransaction');
const Block = require('./Block');
const mineBlock = require('./MiningAlgorithm');

// Read transactions from mempool folder
const mempoolFolderPath = './mempool';
const transactions = [];

fs.readdirSync(mempoolFolderPath).forEach(file => {
    const filePath = `${mempoolFolderPath}/${file}`;
    const data = fs.readFileSync(filePath, 'utf8');
    const transaction = JSON.parse(data);
    transactions.push(transaction);
});

// Create block header
const blockHeader = new BlockHeader(
    '1.0',                    // Version
    '0000000000000000...',    // Previous block hash
    '123456789abcdef0...',    // Merkle root
    Math.floor(Date.now() / 1000),  // Timestamp (Unix timestamp in seconds)
    '0000ffff00000000...',    // Difficulty target
    0                         // Nonce
);

// Create coinbase transaction
const coinbaseTransaction = new CoinbaseTransaction(
    'miner123',   // Miner's address
    10           // Fees collected
);

// Create block
const block = new Block(blockHeader, [coinbaseTransaction, ...transactions]);

// Mine block
const difficultyTarget = '0000ffff00000000000000000000000000000000000000000000000000000000';
const minedHash = mineBlock(block, difficultyTarget);

// Write mined block hash to output.txt
fs.writeFileSync('output.txt', minedHash, 'utf8');

console.log('Block mined successfully. Mined block hash:', minedHash);
