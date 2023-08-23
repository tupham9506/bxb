const createPage = require('./../../helpers/crawler')
let retry = 0
const Lunch = require('../../models/lunch')
const LunchMenu = require('../../models/lunchMenu')
const moment = require('moment')
const LunchOrder = require('../../models/lunchOrder')
const LunchOrderItem = require('../../models/lunchOrderItem')

module.exports = {
  async index() {
    return await LunchMenu.find({}, null, {
      sort: { name: 1 }
    })

    let lunch = await Lunch.findOne({
      date: moment().format('YYYY-MM-DD')
    })

    if (!lunch) {
      retry = 0
      let menu = []
      while (retry < 10) {
        try {
          menu = await getMenu()
        } catch (e) {
          console.log(e)
        }
        if (menu.length) break

        retry++
      }
      console.log(menu)
      for (let item of menu) {
        let lunchMenu = await LunchMenu.findOne({
          id: item.id
        })

        if (!lunchMenu) {
          lunchMenu = await LunchMenu.create(item)
        }
      }
      return menu
    }

    return lunch
  },
  async getOrder() {
    return await LunchOrder.findOne({
      date: moment().format('YYYY-MM-DD')
    }).populate({
      path: 'lunch_order_items',
      populate: [
        {
          path: 'user'
        },
        {
          path: 'lunch_menu'
        }
      ]
    })
  },
  async order(data, socket) {
    const date = moment().format('YYYY-MM-DD')
    let lunchOrder = await LunchOrder.findOne({ date }).populate({
      path: 'lunch_order_items',
      populate: [
        {
          path: 'user'
        }
      ]
    })

    if (!lunchOrder) {
      lunchOrder = await LunchOrder.create({
        date,
        total: 0,
        promos: [
          {
            title: 'Freeship',
            price: 15000
          }
        ]
      })
    }

    let lunchOrderItem = null
    for (let item of lunchOrder.lunch_order_items) {
      if (item.user._id.toString() === socket.auth.id) {
        lunchOrderItem = item
        break
      }
    }

    if (!lunchOrderItem) {
      lunchOrderItem = await LunchOrderItem.create({
        user: socket.auth.id,
        lunch_menu: data.id
      })

      await LunchOrder.updateOne(
        {
          _id: lunchOrder._id
        },
        {
          $push: {
            lunch_order_items: lunchOrderItem._id
          }
        }
      )
    } else {
      await LunchOrderItem.updateOne(
        {
          _id: lunchOrderItem._id
        },
        {
          $set: {
            lunch_menu: data.id
          }
        }
      )
    }

    lunchOrder = await LunchOrder.findOne({
      _id: lunchOrder._id
    }).populate({
      path: 'lunch_order_items',
      populate: [
        {
          path: 'lunch_menu'
        }
      ]
    })

    console.log(lunchOrder)

    let amount = 0
    let discount = 0

    for (let item of lunchOrder.lunch_order_items) {
      amount += item.lunch_menu.price
    }

    for (let item of lunchOrder.promos) {
      discount += item.price
    }

    const total = amount - discount
    await LunchOrder.updateOne(
      {
        _id: lunchOrder._id
      },
      {
        $set: {
          amount,
          discount,
          total
        }
      }
    )
  },
  async getOrderTotal() {
    return await LunchOrder.find({
      date: moment().format('YYYY-MM-DD')
    })
  }
}

const getMenu = async () => {
  const page = await createPage(
    'https://food.grab.com/vn/vi/restaurant/c%C6%A1m-thu-ph%C6%B0%C6%A1ng-c%C6%A1m-v%C4%83n-ph%C3%B2ng-delivery/5-C2WTEVLBNFCUET'
  )
  const json = JSON.parse(await (await page.waitForSelector('#__NEXT_DATA__')).evaluate(el => el.textContent))
  const items = json.props.initialReduxState.pageRestaurantDetail.entities['5-C2WTEVLBNFCUET'].menu.categories[1].items

  const menu = []

  items.forEach(item => {
    const name = capitalize(item.name).replace(/Cơm/, '')
    menu.push({
      id: item.ID,
      price: item.discountedPriceInMin,
      name: name,
      image: item.imgHref || 'https://www.freeiconspng.com/uploads/no-image-icon-6.png',
      available: true
    })
  })

  return menu
}

const capitalize = str => {
  const splitStr = str.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}
