import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import {
  handleShowAdminOptions,
  handleShowProfile
} from "../slice/utilitySlices";
import styles from "../styles/ChatBox.module.css";
import { ChatType, UserType } from "../types/types";
import loadChat from "../utils/loadChat";

interface UserBoxProps {
  user: UserType;
  setSearchQuery?: any;
  socket: any;
  func?: any;
  getChat: boolean;
  setSelectedUser?: any;
  isAdminTagNeeded: boolean;
  isReaction?: boolean;
  removeReaction: any;
}

const UserBox: FC<UserBoxProps> = ({
  user,
  setSearchQuery,
  socket,
  func,
  getChat,
  setSelectedUser,
  isAdminTagNeeded,
  isReaction,
  removeReaction,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const {
    selectedChat,
  }: { selectedChat: ChatType } = useCustomSelector(
    (state) => state.chats
  );


  const fetchChat = async () => {

    if (isReaction) {
      removeReaction()
      return;
    }

    if (setSelectedUser) {
      dispatch(handleShowAdminOptions(true));
      setSelectedUser({
        _id: user._id,
        username: user.username,
        name: user.name,
        image: user.image,
        email: user.email,
      });
      return;
    }

    if (!getChat) {
      func({
        _id: user._id,
        username: user.username,
        name: user.name,
        image: user.image,
        email: user.email,
      });
      return;
    }

    dispatch(handleShowProfile(false));


    loadChat(dispatch, navigate, loggedInUser, user, socket, setSearchQuery)
  };

  return (
    <div className={styles.container} onClick={fetchChat}>
      <div className={styles.pfp}>
        <img loading="eager" src={user.image} alt={user.name} />
      </div>
      <div className={styles.details}>
        <p
          className={styles.user_name}
          style={{ justifyContent: "flex-start" }}
        >
          {user._id === loggedInUser._id ? "You" : user.name}{" "}
          {selectedChat?.admins?.includes(user._id) && isAdminTagNeeded ? (
            <span className={styles.admin}>Admin</span>
          ) : null}
        </p>
        <p className={styles.latest_message}>
          <span>{isReaction ? "Tap to remove your reaction" : user.email}</span>
        </p>
      </div>
    </div>
  );
};

export default UserBox;
