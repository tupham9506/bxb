const { BallCoin } = require('../../helpers/ballCoin')
const _ = require('lodash')

const userA = (module.exports = app => {
  app.get('/coin', async (req, res) => {
    if (req.query.step == 1) {
      return res.json(step1())
    }

    if (req.query.step == 2) {
      return res.json(step2())
    }

    // User A nhận 100 coin từ việc sáng tạo Ball Coin
    let block = userA.createBlock([
      {
        from: '',
        to: 'AddressA',
        amount: 1000
      }
    ])

    // Publish thông tin lên mạng rằng tôi đã tạo 1 chuỗi mới
    // User B nhận thông tin có 1 khối mới được tạo
    const userBMinted = userB.mint(block, 'AddressB')
    const userCMinted = userC.mint(block, 'AddressC')

    userA.addToChain(userBMinted)
    userB.addToChain(userBMinted)
    userC.addToChain(userBMinted)

    result = [
      'User A nhận 1000 coin từ việc sáng tạo Ball Coin',
      [
        {
          from: '',
          to: 'AddressA',
          amount: 1000
        }
      ],
      'User B, C nhận được thông tin rằng có 1 transaction mới sẽ thực hiện mint',
      'Kết quả mint của user B:',
      userBMinted,
      'Kết quả mint của user C:',
      userCMinted,
      'Người chiến thắng: user B. User A, B, C kiểm tra tính hợp lệ của Block sau đó sẽ quyết định xem có thêm Block mà B đã đào vào chuỗi.',
      'userA',
      userA.chain,
      'userB',
      userB.chain,
      'userC',
      userC.chain
    ]

    if (req.query.step == 2) {
      return res.send(result)
    }
  })
})

function step1() {
  // 1. Tạo chuỗi block
  const baseCoin = new BallCoin()
  const userA = new BallCoin()
  const userB = new BallCoin()
  const userC = new BallCoin()

  return {
    baseCoin,
    userA: userA.chain,
    userB: userB.chain,
    userC: userC.chain
  }
}

function step2() {
  // User A nhận 100 coin từ việc sáng tạo Ball Coin
  let block = userA.createBlock([
    {
      from: '',
      to: 'AddressA',
      amount: 1000
    }
  ])

  // Publish thông tin lên mạng rằng tôi đã tạo 1 chuỗi mới
  // User B nhận thông tin có 1 khối mới được tạo
  const userBMinted = userB.mint(block, 'AddressB')
  const userCMinted = userC.mint(block, 'AddressC')

  userA.addToChain(userBMinted)
  userB.addToChain(userBMinted)
  userC.addToChain(userBMinted)

  result = [
    'User A nhận 1000 coin từ việc sáng tạo Ball Coin',
    [
      {
        from: '',
        to: 'AddressA',
        amount: 1000
      }
    ],
    'User B, C nhận được thông tin rằng có 1 transaction mới sẽ thực hiện mint',
    'Kết quả mint của user B:',
    userBMinted,
    'Kết quả mint của user C:',
    userCMinted,
    'Người chiến thắng: user B. User A, B, C kiểm tra tính hợp lệ của Block sau đó sẽ quyết định xem có thêm Block mà B đã đào vào chuỗi.',
    'userA',
    userA.chain,
    'userB',
    userB.chain,
    'userC',
    userC.chain
  ]

  if (req.query.step == 2) {
    return res.send(result)
  }
}
