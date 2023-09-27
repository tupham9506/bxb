const SHA256 = require('sha256')
const chain = []

module.exports = app => {
  app.get('/coin', async (req, res) => {
    if (!chain.length) {
      chain.push(createGenesisBlock())
    }

    const transaction = createNewTransaction('1', 'A', 'B')
    createNewBlock(transaction)
    console.log(isChainValid())
    return res.json(chain)
  })
}

function createGenesisBlock() {
  return {
    index: 1,
    timestamp: Date.now(),
    data: [],
    nonce: 0,
    hash: 'hash',
    prevHash: 'prevHash'
  }
}

function getLastBlock() {
  return chain[chain.length - 1]
}

function generateHash(prevHash, timestamp, data) {
  let hash = ''
  let nonce = 0

  while (hash.substring(0, 3) !== '000') {
    nonce++
    hash = SHA256(prevHash + timestamp + JSON.stringify(data) + nonce).toString()
  }

  return { hash, nonce }
}

function createNewTransaction(amount, sender, recipient) {
  return {
    amount,
    sender,
    recipient
  }
}

function createNewBlock(data) {
  const timestamp = Date.now()
  const prevHash = getLastBlock().hash
  const generatedHash = generateHash(prevHash, timestamp, data)

  const newBlock = {
    index: chain.length + 1,
    timestamp,
    data,
    nonce: generatedHash.nonce,
    hash: generatedHash.hash,
    prevHash
  }

  chain.push(newBlock)

  return newBlock
}

function isChainValid() {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i]
    const previousBlock = chain[i - 1]

    // Recalculate the hash of the block and see if it matches up.
    // This allows us to detect changes to a single block
    if (currentBlock.hash !== generateHash(currentBlock.hash)) {
      return false
    }

    // Check if this block actually points to the previous block (hash)
    if (currentBlock.prevHash !== previousBlock.hash) {
      return false
    }
  }
  // Check the genesis block
  if (chain[0] !== createGenesisBlock()) {
    return false
  }

  // If we managed to get here, the chain is valid!
  return true
}
