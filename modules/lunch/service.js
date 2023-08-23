const createPage = require('./../../helpers/crawler')
let retry = 0
const Lunch = require('../../models/lunch')
const LunchMenu = require('../../models/lunch')
const moment = require('moment')

module.exports = {
  async index() {
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
          name: item.name
        })
        if (lunchMenu) {
          lunchMenu = await LunchMenu.create(item)
        }
      }
      return menu
    }

    return lunch
  }
}

const getMenu = async () => {
  const page = await createPage(
    'https://food.grab.com/vn/en/restaurant/c%C6%A1m-thu-ph%C6%B0%C6%A1ng-c%C6%A1m-v%C4%83n-ph%C3%B2ng-delivery/5-C2WTEVLBNFCUET'
  )
  const json = JSON.parse(await (await page.waitForSelector('#__NEXT_DATA__')).evaluate(el => el.textContent))
  const items = json.props.initialReduxState.pageRestaurantDetail.entities['5-C2WTEVLBNFCUET'].menu.categories[1].items

  const menu = []

  items.forEach(item => {
    if (!item.available) return false
    const name = capitalize(item.name).replace(/Cơm/, '')
    menu.push({
      name: name,
      accessory: {
        type: 'image',
        image_url: item.imgHref || 'https://www.freeiconspng.com/uploads/no-image-icon-6.png',
        alt_text: name
      }
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
