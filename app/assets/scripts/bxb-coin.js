function BxbCoin() {
  this.mempool = []
  this.chain = []
  this.difficulty = 5
  this.reward = 100

  /**
   * Tạo khối genesis
   */
  this.init = () => {
    const block = {
      time: Date.parse('2000-01-01'),
      data: [],
      nonce: 0,
      prevHash: ''
    }

    block.hash = this.createHash(block)
    this.chain.push(block)
  }

  /**
   * Tạo hash cho các dữ liệu trong khối
   */
  this.createHash = block => {
    return window.CryptoJS.SHA256(block.prevHash + block.time + JSON.stringify(block.data) + block.nonce).toString()
  }

  /**
   * Đặt chữ ký cho transaction
   */
  this.sign = transaction => {
    return window.walletSecret
      .sign(window.CryptoJS.SHA256(transaction.from, transaction.to, transaction.amount).toString(), 'base64')
      .toDER('hex')
  }

  /**
   * Tạo 1 block
   */
  this.createBlock = data => {
    for (let transaction of data) {
      if (transaction.from) {
        transaction.sign = this.sign(transaction)
      }
    }

    return {
      prevHash: this.chain[this.chain.length - 1].hash,
      time: Date.now(),
      data
    }
  }

  /**
   * Mint
   */
  this.mint = (block, address) => {
    block.hash = ''
    block.nonce = 0
    block.data.push({
      from: '',
      to: address,
      amount: this.reward
    })

    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++
      block.hash = this.createHash(block)
    }

    return block
  }

  /**
   * Thêm vào blockchain
   */
  this.addToChain = block => {
    let prevBlock = this.chain[this.chain.length - 1]
    if (prevBlock.hash === block.prevHash) {
      this.chain.push(block)
    }
    this.mempool = this.mempool.filter(item => item.prevBlock !== block.prevBlock)
  }
}
