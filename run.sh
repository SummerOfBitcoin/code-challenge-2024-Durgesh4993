#!/bin/bash

# Step 1: Read transactions from the mempool folder
mempoolFolderPath="./mempool"
transactions=()
for file in "$mempoolFolderPath"/*.json; do
    transaction=$(cat "$file")
    transactions+=("$transaction")
done

# Step 2: Construct a block header
version="1.0"
previousBlockHash="0000000000000000..."  # Example previous block hash
timestamp=$(date +%s)
difficultyTarget="0000ffff00000000..."   # Example difficulty target
nonce=0
merkleRoot=$(calculateMerkleRoot "${transactions[@]}")
blockHeader="$version|$previousBlockHash|$merkleRoot|$timestamp|$difficultyTarget|$nonce"

# Step 3: Create a coinbase transaction
minerAddress="miner123"  # Example miner's address
feesCollected=10          # Example fees collected
coinbaseTransaction="$minerAddress|$feesCollected"

# Step 4: Validate and add transactions to the block
validTransactions=()
for transaction in "${transactions[@]}"; do
    if validateTransaction "$transaction"; then
        validTransactions+=("$transaction")
    fi
done

# Step 5: Add valid transactions to the block and update the merkle root
blockTransactions=("$coinbaseTransaction")
blockTransactions+=("${validTransactions[@]}")
merkleRoot=$(calculateMerkleRoot "${blockTransactions[@]}")
blockHeader="$version|$previousBlockHash|$merkleRoot|$timestamp|$difficultyTarget|$nonce"

# Step 6: Mine the block
while true; do
    hash=$(hashBlockHeader "$blockHeader")
    if [[ "$hash" < "$difficultyTarget" ]]; then
        break
    fi
    ((nonce++))
    blockHeader="$version|$previousBlockHash|$merkleRoot|$timestamp|$difficultyTarget|$nonce"
done

# Step 7: Output block header, serialized coinbase transaction, and transaction IDs to output.txt
echo "$blockHeader" > output.txt
echo "$coinbaseTransaction" >> output.txt
for transaction in "${blockTransactions[@]}"; do
    echo "$transaction" | jq -r '.id' >> output.txt
done
