function formatLastSeen(inputDate: string) {
  const date = new Date(inputDate);
  const now = new Date();
  //@ts-ignore
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return `Today at ${getFormattedTime(date)}`;
  } else if (diffInHours < 48) {
    return `Yesterday at ${getFormattedTime(date)}`;
  } else if (diffInHours < 24 * 7) {
    const daysAgo = Math.floor(diffInHours / 24);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24 * 30) {
    const weeksAgo = Math.floor(diffInHours / (24 * 7));
    return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24 * 365) {
    const monthsAgo = Math.floor(diffInHours / (24 * 30));
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
  } else {
    const yearsAgo = Math.floor(diffInHours / (24 * 365));
    return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
  }
}

function getFormattedTime(date: Date) {
  const hours = date.getHours(); // Use original hours for leading zero formatting
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${padWithZero(hours)}:${padWithZero(date.getMinutes())} ${ampm}`;
}

function padWithZero(number: number) {
  return number < 10 ? `0${number}` : number;
}

function getAMPM(date: Date) {
  const hours = date.getHours() % 12;
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${hours === 0 ? 12 : hours}:${padWithZero(
    date.getMinutes()
  )} ${ampm}`;
}

export default formatLastSeen;
