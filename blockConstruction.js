const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// BlockHeader class to represent the header of a block
class BlockHeader {
    constructor(version, previousBlockHash, merkleRoot, timestamp, difficultyTarget, nonce, hash = '') {
        this.version = version;
        this.previousBlockHash = previousBlockHash;
        this.merkleRoot = merkleRoot;
        this.timestamp = timestamp;
        this.difficultyTarget = difficultyTarget;
        this.nonce = nonce;
        this.hash = hash;
    }
}

// CoinbaseTransaction class to represent the coinbase transaction
class CoinbaseTransaction {
    constructor(minerAddress, feesCollected) {
        this.minerAddress = minerAddress;
        this.feesCollected = feesCollected;
    }
}

// Transaction class to represent individual transactions
class Transaction {
    constructor(sender, receiver, amount, timestamp, id = '') {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = timestamp;
        this.id = id;
    }
}

// Function to validate a transaction
function validateTransaction(transaction) {
    // Validate transaction inputs, outputs, and signatures
    // Example validation logic:
    if (!(transaction instanceof Transaction)) {
        console.error('Invalid transaction format:', transaction);
        return false;
    }
    // Perform additional validation checks as needed
    return true;
}

// Function to calculate the Merkle root from a list of transaction hashes
function calculateMerkleRoot(transactions) {
    let transactionHashes = transactions.map(transaction => crypto.createHash('sha256').update(JSON.stringify(transaction)).digest());

    while (transactionHashes.length > 1) {
        const newHashes = [];
        for (let i = 0; i < transactionHashes.length; i += 2) {
            const combinedHash = (i + 1 < transactionHashes.length) ? Buffer.concat([transactionHashes[i], transactionHashes[i + 1]]) : transactionHashes[i];
            const newHash = crypto.createHash('sha256').update(combinedHash).digest();
            newHashes.push(newHash);
        }
        transactionHashes = newHashes;
    }

    return transactionHashes[0].toString('hex');
}

// Function to mine a block
function mineBlock(block, difficultyTarget) {
    while (true) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(block.header)).digest('hex');
        if (hash < difficultyTarget) {
            return hash;
        }
        block.header.nonce++;
    }
}

// Define the path to the mempool folder
const mempoolFolderPath = './mempool';

// Read the list of files in the mempool folder
fs.readdir(mempoolFolderPath, (err, files) => {
    if (err) {
        console.error('Error reading mempool folder:', err);
        return;
    }
    const transactions = [];
    // Iterate through each file in the mempool folder
    files.forEach(file => {
        // Construct the full path to the file
        const filePath = path.join(mempoolFolderPath, file);
        // Read the contents of the file
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            // Parse the JSON data to extract transaction details
            const transaction = JSON.parse(data);
            transactions.push(transaction);
        } catch (parseError) {
            console.error(`Error parsing JSON in file ${file}:`, parseError);
        }
    });
    // Create a block header
    const version = '1.0';
    const previousBlockHash = '0000000000000000...'; // Example previous block hash
    const timestamp = Math.floor(Date.now() / 1000);
    const difficultyTarget = '0000ffff00000000...'; // Example difficulty target
    let nonce = 0;
    const merkleRoot = calculateMerkleRoot(transactions);
    const blockHeader = new BlockHeader(version, previousBlockHash, merkleRoot, timestamp, difficultyTarget, nonce);
    // Create a coinbase transaction
    const minerAddress = 'miner123'; // Example miner's address
    const feesCollected = 10; // Example fees collected
    const coinbaseTransaction = new CoinbaseTransaction(minerAddress, feesCollected);
    // Create a block
    const block = {
        header: blockHeader,
        transactions: [coinbaseTransaction],
    };
    // Validate and add transactions to the block
    for (const transaction of transactions) {
        if (validateTransaction(transaction)) {
            block.transactions.push(transaction);
            block.header.merkleRoot = calculateMerkleRoot(block.transactions);
        }
    }
    // Mine the block
    const minedHash = mineBlock(block, difficultyTarget);
    block.header.hash = minedHash;
    // Write block header and serialized coinbase transaction to output.txt
    const serializedBlockHeader = JSON.stringify(block.header);
    const serializedCoinbaseTransaction = JSON.stringify(coinbaseTransaction);
    const transactionIds = block.transactions.map(transaction => transaction.id).join('\n');
    const outputData = `${serializedBlockHeader}\n${serializedCoinbaseTransaction}\n${transactionIds}`;
    fs.writeFileSync('output.txt', outputData, 'utf8');
});
