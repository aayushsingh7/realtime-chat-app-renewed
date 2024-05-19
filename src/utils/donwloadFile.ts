import { MessageType } from "../types/types";

const donwloadFile = (data: MessageType) => {
  fetch(data.message).then((response) => {
    response.blob().then((blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      let alink: HTMLAnchorElement = document.createElement("a");
      alink.href = fileURL;
      alink.download = data.fileName;
      alink.click();
    });
  });
};

export default donwloadFile;
