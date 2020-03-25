export default function (datetime, time) {
    if(datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + '-'
        let mon = numFormat(datetime.getMonth()+1)+ '-'
        let d = numFormat(datetime.getDate())
        let hours = numFormat(datetime.getHours()) + ':'
        let minutes = numFormat(datetime.getMinutes()) + ':'
        let seconds = numFormat(datetime.getSeconds())
        if (time) return hours + minutes + seconds
        else return y + mon + d + '\n' + hours + minutes + seconds
    }
    return '—'
}

function numFormat (num) {
    return num<10? '0'+num: num
}
