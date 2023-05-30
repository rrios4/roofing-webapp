export default function monthDDYYYYFormat(date) {
  let parsedDate = new Date(Date.parse(date));
  let dateString = parsedDate.toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );
  return dateString;
}
