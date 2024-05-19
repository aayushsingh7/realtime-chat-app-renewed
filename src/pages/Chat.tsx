import { FC } from "react";
import Messages from "../layouts/Messages";

interface ChatProps {
  socket: any;
  socketConnected: boolean;
}

const Chat: FC<ChatProps> = ({ socket, socketConnected }) => {
  return (
    <>
      {socketConnected &&
        <Messages socket={socket} />
      }
    </>
  );
};

export default Chat;
