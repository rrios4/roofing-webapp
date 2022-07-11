export default function formatNumber(value){
    return value.toLocaleString('en-US', {
        minimumIntegerDigits: 4,
        useGrouping: false
    })
}