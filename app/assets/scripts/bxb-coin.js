function BxbCoin() {
  this.mempool = [] // Danh sách các block đang chờ xác nhận
  this.chain = [] // Chuỗi Blockchain
  this.difficulty = 5 // Độ khó của bài toán
  this.reward = 100 // Phần thưởng cho mỗi lần đào

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
   * Tạo chữ ký cho mỗi transaction trong 1 block
   */
  this.sign = transaction => {
    return window.walletSecret
      .sign(window.CryptoJS.SHA256(transaction.from, transaction.to, transaction.amount).toString(), 'base64')
      .toDER('hex')
  }

  /**
   * Tạo 1 block giao dịch
   */
  this.createTransaction = data => {
    for (let transaction of data) {
      if (transaction.from) {
        transaction.sign = this.sign(transaction)
      }
    }

    return {
      time: Date.now(),
      data
    }
  }

  this.createBlock = data => {
    console.log(data)
    data.prevHash = this.chain[this.chain.length - 1].hash
    window.bxbCoin.mempool.push(data)
  }

  /**
   * Đào 1 block
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
   * Khối được chấp thuận sẽ được thêm vào blockchain và xóa khỏi mempool
   */
  this.addToChain = block => {
    let prevBlock = this.chain[this.chain.length - 1]
    if (prevBlock.hash === block.prevHash) {
      this.chain.push(block)
    }
    this.mempool = this.mempool.filter(item => item.prevBlock !== block.prevBlock)
  }
}
