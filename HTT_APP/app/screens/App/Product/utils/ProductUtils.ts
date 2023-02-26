export const checkDuplicatePrice = (price: string) => {
  let splitPrice = price?.split('-')
  if (!!splitPrice && splitPrice.length == 2) {
    let priceOne = splitPrice[0].trim()
    let priceTwo = splitPrice[1].trim()

    if (priceOne == priceTwo) return priceOne
    else return price
  } else return price
}

export const genProductAttributeName = (data: any) => {
  const attribute_name_1 =
    data?.product_attribute_name_1?.name || data?.product_attribute_name_1
  const attribute_name_2 =
    data?.product_attribute_name_2?.name || data?.product_attribute_name_2
  const attribute_name =
    !!attribute_name_1 && !attribute_name_2
      ? `${attribute_name_1}`
      : !!attribute_name_1 && !!attribute_name_2
      ? `${attribute_name_1} 〡 ${attribute_name_2}`
      : ''

  return attribute_name
}
