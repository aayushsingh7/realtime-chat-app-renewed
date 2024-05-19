const messageSeenFunc = async (messageIds: string[]) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/message-seen`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: messageIds }),
      }
    );
    const data = await response.json();
  } catch (err) {}
};

export default messageSeenFunc;
