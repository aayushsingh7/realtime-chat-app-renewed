function formatTime(dateTime: string) {
  const currentDate = new Date();
  const messageDate = new Date(dateTime);
  //@ts-ignore
  const diffInMilliseconds = currentDate - messageDate;
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

  if (diffInHours < 24) {
    const formattedTime = messageDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  } else if (diffInHours >= 24 && diffInHours < 48) {
    return "Yesterday";
  } else if (diffInHours >= 48 && diffInHours < 24 * 7) {
    const formattedDate = messageDate.toLocaleDateString("en-US");
    return formattedDate;
  } else if (diffInHours >= 24 * 7 && diffInHours < 24 * 30) {
    const weeksAgo = Math.floor(diffInHours / (24 * 7));
    return weeksAgo === 1 ? "1 week ago" : weeksAgo + " weeks ago";
  } else if (diffInHours >= 24 * 30 && diffInHours < 24 * 365) {
    const monthsAgo = Math.floor(diffInHours / (24 * 30));
    return monthsAgo === 1 ? "1 month ago" : monthsAgo + " months ago";
  } else {
    const yearsAgo = Math.floor(diffInHours / (24 * 365));
    return yearsAgo === 1 ? "1 year ago" : yearsAgo + " years ago";
  }
}

export default formatTime;
