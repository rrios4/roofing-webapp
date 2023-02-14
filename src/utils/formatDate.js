export default function formatDate(date) {
  let parsedDate = new Date(Date.parse(date));
  let options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
  let dateString = parsedDate.toLocaleDateString('en-US', options);
  return dateString;
}
