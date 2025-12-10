const updateLastMessageSeen = async (lastSeenMessagePerChat:any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/chats/last-seen-bulk`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({lastSeenMessagePerChat}),
        keepalive:true 
      }
    );
    const data = await response.json();
  } catch (err) {}
};

export default updateLastMessageSeen;
