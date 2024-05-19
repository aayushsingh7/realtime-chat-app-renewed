const sendNotification = (
  heading: string,
  body: string,
  tag: string,
  url: string
) => {
  const notification = new Notification(heading, {
    body: body,
    tag: tag,
    data: { chatURL: url },
  });
  notification.addEventListener("click", (e) => {
    //@ts-ignore
    window.open(e.target.data.chatURL, "_blank");
  });
};

export default sendNotification;
