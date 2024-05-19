const scrollToMessage = (messageId: string, activeClassName: string) => {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    messageElement.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "nearest",
    });
  }
  messageElement?.classList.add(`${activeClassName}`);
  setTimeout(() => {
    messageElement?.classList.remove(`${activeClassName}`);
  }, 1500);
};

export default scrollToMessage;
