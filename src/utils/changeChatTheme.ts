import { ChatType } from "../types/types";

const changeChatTheme = async (
  themeDetails: any,
  selectedChat: ChatType,
  file: string | null
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/change-theme`,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({
          chatId: selectedChat._id,
          file: file,
          themeDetails,
        }),
      }
    );
    const data = await response.json();
    return data.theme;
  } catch (err) {
    console.log(err);
  }
};

export default changeChatTheme;
