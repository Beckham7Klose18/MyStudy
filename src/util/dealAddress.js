export default function (areaInfo) {
  let {address} = areaInfo
  const {province, city, county} = areaInfo
  address = address.replace(province, '')
  address = address.replace(city, '')
  address = address.replace(county, '')
  return province + city+ county + address
}
