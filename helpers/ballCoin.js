const crypto = require('crypto')
const _ = require('lodash')

class BallCoin {
  chain = []
  difficulty = 4
  bonus = 100

  constructor() {
    const block = {
      time: Date.parse('2000-01-01'),
      data: [],
      nonce: 0
    }
    block.hash = this.createHash(block)
    this.chain.push(block)
  }

  createHash(block) {
    return crypto
      .createHash('sha256')
      .update(block.prevHash + block.time + JSON.stringify(block.data) + block.nonce)
      .digest('hex')
  }

  createBlock(data) {
    return {
      prevHash: this.chain[this.chain.length - 1].prevHash,
      time: Date.now(),
      data
    }
  }

  receiveNewBloc() {}

  mint(block, address) {
    block = _.cloneDeep(block)
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

  addToChain(acceptBlock) {
    this.chain.push(acceptBlock)
  }
}

module.exports.BallCoin = BallCoin
