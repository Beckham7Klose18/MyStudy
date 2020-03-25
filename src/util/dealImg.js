export default function (detailsText) {
  detailsText = detailsText && dealImg(detailsText, 0).replace(/<br>/gi, "<br/>").replace(/&nbsp;/gi, " ")
  if (! detailsText.includes('<div class="ql-editor">')) detailsText = '<div class="ql-editor">' + detailsText + '</div>'
  return detailsText
}

function dealImg(detailsText, index) {
    const imgIndex = detailsText.indexOf("<img", index)
    if (imgIndex == -1) return detailsText
    const endIndex = detailsText.indexOf(">", imgIndex)
    const newDetailsText = detailsText.slice(0, endIndex).concat("/>", detailsText.slice(endIndex + 1))
    return dealImg(newDetailsText, endIndex + 2)
}
