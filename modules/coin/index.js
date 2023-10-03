var path = require('path')

module.exports = app => {
  app.get('/coin', function (_req, res) {
    res.sendFile(path.join(__dirname + '/page.html'))
  })

  global.io.on('connection', async socket => {
    socket.join('COIN_CHANNEL')
    socket.on('NEW_BLOCK', data => {
      global.io.in('COIN_CHANNEL').emit('NEW_BLOCK', data)
    })

    socket.on('MINT_BLOCK', data => {
      global.io.in('COIN_CHANNEL').emit('MINT_BLOCK', data)
    })
  })

  app.get('/coin-2', function (req, res) {
    const { Blockchain, Transaction } = require('../../helpers/bxbBlock')
    const EC = require('elliptic').ec
    const ec = new EC('secp256k1')

    // Your private key goes here
    const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf')

    // From that we can calculate your public key (which doubles as your wallet address)
    const myWalletAddress = myKey.getPublic('hex')

    // Create new instance of Blockchain class
    const savjeeCoin = new Blockchain()

    // Mine first block
    savjeeCoin.minePendingTransactions(myWalletAddress)

    // Create a transaction & sign it with your key
    const tx1 = new Transaction(myWalletAddress, 'address2', 100)
    tx1.sign(myKey)
    savjeeCoin.addTransaction(tx1)

    // Mine block
    savjeeCoin.minePendingTransactions(myWalletAddress)

    // Create second transaction
    const tx2 = new Transaction(myWalletAddress, 'address1', 50)
    tx2.sign(myKey)
    savjeeCoin.addTransaction(tx2)

    // Mine block
    savjeeCoin.minePendingTransactions(myWalletAddress)

    console.log()
    console.log(`Balance of xavier is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`)

    // Uncomment this line if you want to test tampering with the chain
    // savjeeCoin.chain[1].transactions[0].amount = 10;

    // Check if the chain is valid
    console.log()
    console.log('Blockchain valid?', savjeeCoin.isChainValid() ? 'Yes' : 'No')
    return res.json(savjeeCoin)
  })
}
