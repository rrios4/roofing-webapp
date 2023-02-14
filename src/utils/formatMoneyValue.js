export default function formatMoneyValue(input) {
  return input?.toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
}
