import { Enterprise } from '../model/Cart'

const usePaymentData = (data: Array<Enterprise>) => {
  var dataParser = [...data]

  dataParser = dataParser
    .map((enterprise, index, object) => {
      return {
        ...enterprise,
        Stocks: enterprise.Stocks.filter(stock =>
          stock.ProductPrices.some(product => product.isCheck == true)
        ),
      }
    })
    .filter(item => !!item.Stocks.length)

  const paymentPayload = {
    carts: dataParser.map(enterprise => ({
      items: enterprise.Stocks.map(stock => {
        const stockPrice = stock.ProductPrices.reduce((acc, curr) => {
          return acc + (curr.isCheck ? curr?.price! * curr?.Cart.amount! : 0)
        }, 0)

        const discount =
          !!stock?.voucher && !!Object.keys(stock?.voucher).length
            ? stock?.voucher.discount
            : 0

        return {
          products: stock.ProductPrices.map(product => {
            if (product.isCheck)
              return {
                amount: product.Cart.amount,
                product_price_id: product.Cart.product_price_id,
              }
            else return null
          }).filter(Boolean),
          cart_id: stock.ProductPrices.map(product => {
            if (product.isCheck) return product.Cart.id
            else return null
          }).filter(Boolean),
          total_money: stockPrice,
          note: 'note',
          stock_id: stock.id,
          total_discount: stockPrice - discount,
          purchase_gift_id: !!Object.keys(stock.voucher).length
            ? stock.voucher.id
            : 0,
        }
      }),
      pancake_shop_key: enterprise?.pancake_shop_key,
      shop_id: enterprise.id,
    })),
  }

  let totalDiscount = 0
  dataParser.forEach(enter => {
    enter.Stocks.forEach(stock => {
      if (!!stock?.voucher && !!Object.keys(stock?.voucher).length) {
        totalDiscount += stock?.voucher.discount
      }
    })
  })

  return { dataParser, paymentPayload, totalDiscount }
}

export default usePaymentData
