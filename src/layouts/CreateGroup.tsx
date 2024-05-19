import { FC, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { RiUserSearchLine } from "react-icons/ri";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import UserBox from "../components/UserBox";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import { handleCreateGroup } from "../slice/chatSlice";
import { handleLoading, setIsError } from "../slice/utilitySlices";
import styles from "../styles/CreateGroup.module.css";
import { MessageType, UserType } from "../types/types";
import generateID from "../utils/generateID";
import searchUsers from "../utils/searchUsers";
import ConfirmDialog from "./ConfirmDialog";

interface CreateGroupProps {
  socket: any;
}

const CreateGroup: FC<CreateGroupProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const loggedInUser = useCustomSelector((state) => state.user.loggedInUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([
    { _id: loggedInUser._id, username: loggedInUser.username },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    description: "",
  });
  const [imageDataURL, setImageDataURL] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imgWarning, setImgWarning] = useState<boolean>(false)

  const handleInput = (e: any) => {
    setGroupInfo((old) => {
      return { ...old, [e.target.name]: e.target.value };
    });
  };

  const handleFilePreivew = (file: any) => {
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFilePreivew(file);
    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const dataURL = e.target.result;
        setImageDataURL(dataURL);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      dispatch(setIsError(true));
    }
  };

  const handleClickUser = (newUser: UserType) => {
    setSelectedUsers((oldUsers: UserType[]) => {
      const isUserExist = oldUsers.some(
        (user: UserType) => user._id === newUser._id
      );
      if (isUserExist) {
        return oldUsers.filter((user: UserType) => user._id !== newUser._id);
      } else {
        return [...oldUsers, newUser];
      }
    });
  };

  const createGroupFunc = async (e: any) => {
    e.preventDefault()
    if (!imagePreview) return setImgWarning(true)
    dispatch(handleLoading(true))
    try {
      setImgWarning(false)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group-chat/create-new-group`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            users: JSON.stringify(
              selectedUsers.map((user: UserType) => user._id)
            ),
            groupName: groupInfo.name,
            description: groupInfo.description,
            image: imageDataURL,
            moderator: {
              _id: loggedInUser._id,
              name: loggedInUser.name,
            },
          }),
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        const dummyMessage: MessageType = {
          _id: generateID(),
          createdAt: new Date().toISOString(),
          document: false,
          message: `Aayush created group "Ganesh"`,
          msgType: "alert",
          seenBy: [{ _id: loggedInUser._id, name: loggedInUser.name }],
          sender: {
            _id: "ariagaroe=29re",
            name: "message_bot",
            image: "..."
          },
        }
        socket.emit("create new chat", data.newChat);
      }
    } catch (err) {
      dispatch(setIsError(true));
    }
    dispatch(handleLoading(false))
    dispatch(handleCreateGroup(false));

  };

  return (
    <>
      {isConfirmed && <ConfirmDialog
        heading="Discard creating group?"
        body="Are u sure u want to discard creating a group?"
        btnText="Confirm"
        onConfirm={() => {
          dispatch(handleCreateGroup(false))
          setIsConfirmed(false)
        }} onCancle={() => setIsConfirmed(false)} />}

      <form className={styles.container} onSubmit={createGroupFunc}>
        <h2>Create Group</h2>
        <div className={styles.part_one}>
          <div className={styles.input_feilds}>
            <div
              className={styles.group_img}
              onClick={() => inputRef.current?.click()}
            >
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                ref={inputRef}
                onChange={handleFileUpload}
              />
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : "https://static.wikia.nocookie.net/naruto/images/d/db/Kushina.png/revision/latest?cb=20150719165408"
                }
                alt="group image"
              />
              <IoMdAdd />

            </div>
            {imgWarning && <p style={{ fontSize: "16px", fontWeight: "500", color: "red", marginBottom: "15px" }}>Please upload a valid image</p>}
            <Input
              name="name"
              required
              onChange={handleInput}
              style={{
                padding: "15px",
                fontSize: "0.75rem",
                color: "var(--primary-text-color)",
                width: "100%",
                background: "var(--light-background)",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
              placeholder="Enter group name"
            />

            <textarea
              onChange={handleInput}
              name="description"
              placeholder="Enter group description (optional)"
            ></textarea>
          </div>

          <div className={styles.add_users}>
            <h2>Add Members</h2>
            {selectedUsers.length > 0 && (
              <div className={styles.tags}>
                {selectedUsers.map((user: UserType) => {
                  return (
                    <span>
                      {user.username}
                      {user._id === loggedInUser._id ? null : (
                        <AiOutlineClose onClick={() => handleClickUser(user)} />
                      )}
                    </span>
                  );
                })}
              </div>
            )}
            <div className={styles.find_users}>
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(setSearchResults, setLoading, e.target.value);
                }}
                style={{
                  padding: "15px",
                  fontSize: "0.75rem",
                  color: "var(--primary-text-color)",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  width: "100%",
                  background: "var(--light-background)",
                  borderBottom: "1px solid var(--lighter-background)",
                  // borderRadius: "10px",
                }}
                placeholder="Search users"
              />
              <div className={styles.users}>
                {loading ? (
                  <Loader />
                ) : searchResults.length > 0 ? (
                  searchResults.map((user: UserType) => {
                    return (
                      <UserBox
                        getChat={false}
                        key={user._id}
                        user={user}
                        socket={socket}
                        func={handleClickUser}
                        setSearchQuery={setSearchQuery}
                      />
                    );
                  })
                ) : (
                  <div style={{ width: "100%", height: "100%" }} className="flex">
                    <p style={{ color: "var(--secondary-text-color)" }}>
                      {searchQuery.trim().length > 0 ? (
                        "No user found"
                      ) : (
                        <RiUserSearchLine
                          style={{
                            color: "var(--secondary-text-color)",
                            fontSize: "80px",
                          }}
                        />
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btn_container}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsConfirmed(true)
            }
            }

            style={{
              padding: "10px 15px",
              fontSize: "0.8rem",
              marginTop: "10px",
              borderRadius: "5px",
              background: "var(--primary-background)",
              border: "2px solid #ff0000",
              color: "#ff0000",
              width: "100%",
              fontWeight: "500",
            }}
            children="Cancle"
          />

          <Button
            type="submit"

            style={{
              padding: "10px 15px",
              fontSize: "0.8rem",
              marginTop: "10px",
              borderRadius: "5px",
              background: "var(--lighter-highlight-background)",
              width: "100%",
              fontWeight: "500",
            }}
            children="Create"
          />
        </div>
      </form>
    </>
  );
};

export default CreateGroup;
