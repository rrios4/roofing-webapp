export default function formatNumber(value){
    return value?.toLocaleString('en-US', {
        minimumIntegerDigits: 3,
        useGrouping: true
    })
}