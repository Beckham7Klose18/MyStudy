export default function() {
  const url = window.location.href;
  let reqParamObj = {}
  if (url.includes("?")) {
    const paramStrs = url.substr(url.indexOf("?") + 1).split("&");
    reqParamObj = paramStrs.reduce((paramObj, paramStr) => {
        const paramArr = paramStr.split('=')
        paramObj[paramArr[0]] = unescape(paramArr[1])
      return paramObj
    }, {})
  }
  return reqParamObj.partnerId
}
