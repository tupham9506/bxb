function BxbCoin() {
  this.mempool = []
  this.chain = []
  this.difficulty = 4
  this.bonus = 100
  this.init = () => {
    const block = {
      time: Date.parse('2000-01-01'),
      data: [],
      nonce: 0
    }

    block.hash = this.createHash(block)
    this.chain.push(block)
  }

  this.createHash = block => {
    return window.CryptoJS.SHA256(block.prevHash + block.time + JSON.stringify(block.data) + block.nonce).toString()
  }

  this.createBlock = data => {
    return {
      prevHash: this.chain[this.chain.length - 1].hash,
      time: Date.now(),
      data
    }
  }

  this.mint = (block, address) => {
    block.hash = ''
    block.nonce = 0
    block.data.push({
      from: '',
      to: address,
      amount: this.bonus
    })

    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++
      block.hash = this.createHash(block)
    }

    return block
  }

  this.addToChain = block => {
    let prevBlock = this.chain[this.chain.length - 1]
    if (prevBlock.hash === block.prevHash) {
      this.chain.push(block)
    }
    this.mempool = this.mempool.filter(item => item.prevBlock !== block.prevBlock)
  }
}
