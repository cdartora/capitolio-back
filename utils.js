const parseDateTime = (dateString, timingsString, isStartTime) => {
  // console.log("dateString value inside parseDateTime: ", dateString);
  const dateParts = dateString.split("/");
  const day = dateParts[0];
  const month = dateParts[1];
  const year = new Date().getFullYear(); // Assuming current year

  const timeMatch = timingsString.match(/\d{2}:\d{2}/);
  let time = timeMatch ? timeMatch[0] : "00"; // Default to 00:00 if no match found
  if (!isStartTime) {
    const formattedDate = `${year}-${month}-${day}T${time}:00`;
    const parsedDate = new Date(formattedDate);
    parsedDate.setHours(parsedDate.getHours() + 1);
    parsedDate.setMinutes(parsedDate.getMinutes() + 30);
    return parsedDate;
  }

  const formattedDate = `${year}-${month}-${day}T${time}:00`;
  const parsedDate = new Date(formattedDate);

  return parsedDate;
};

module.exports = { parseDateTime };
