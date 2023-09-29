const { Blockchain, Transaction } = require('../../helpers/bxbBlock')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
// Your private key goes here
const myKey = ec.keyFromPrivate('test-private')

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex')

module.exports = app => {
  app.get('/coin', async (req, res) => {
    // Create new instance of Blockchain class
    const coin = new Blockchain()

    // Mine first block
    coin.minePendingTransactions(myWalletAddress)

    // Create a transaction & sign it with your key
    const tx1 = new Transaction(myWalletAddress, 'address2', 100)
    tx1.sign(myKey)
    coin.addTransaction(tx1)

    // Mine block
    coin.minePendingTransactions(myWalletAddress)

    // Create second transaction
    const tx2 = new Transaction(myWalletAddress, 'address1', 50)
    tx2.sign(myKey)
    coin.addTransaction(tx2)

    // Mine block
    coin.minePendingTransactions(myWalletAddress)

    return res.json({ coin, balance: coin.getBalanceOfAddress(myWalletAddress), myWalletAddress })
  })
}
