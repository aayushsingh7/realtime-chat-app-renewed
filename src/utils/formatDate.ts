import { MessageType } from "../types/types";

const formatDate = (messages: MessageType[]) => {
  const formattedMessages: string[] = messages.map((message: MessageType) => {
    //@ts-ignore
    const date = new Date(message.createdAt);
    const formattedDate = [
      (date.getMonth() + 1).toString(),
      date.getDate().toString(),
      date.getFullYear(),
    ].join("/");
    let hours = date.getHours();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime =
      [
        hours.toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
      ].join(":") +
      " " +
      amPm;
    return `[${formattedDate} ${formattedTime}] : ${message.message}`;
  });

  formattedMessages.sort((a, b) => {
    const timestampA = new Date(a.match(/\[(.*?)\]/)![1]);
    const timestampB = new Date(b.match(/\[(.*?)\]/)![1]);
    return timestampB.getTime() - timestampA.getTime();
  });

  return formattedMessages.join("\n");
};

export default formatDate;
