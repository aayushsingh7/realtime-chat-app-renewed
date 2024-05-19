import { FC, useEffect, useRef, useState } from "react";
import styles from "../styles/ProfileDetails.module.css";
import { ChatType, UserType } from "../types/types";
import chatInfo from "../utils/chatInfo";
import { useCustomSelector } from "../hooks/useCustomSelector";
import Button from "./Button";
import Input from "./Input";
import { IoMdAdd } from "react-icons/io";
import { handleLoading, setIsError } from "../slice/utilitySlices";
import { useAppDispatch } from "../hooks/useAppDispatch";
import ConfirmDialog from "../layouts/ConfirmDialog";
import deleteMessage from "../utils/deleteMessage";
import formatLastSeen from "../utils/LastSeen";

interface ProfileDetailsProps {
  data: UserType | ChatType;
  setShowAlertMessage?: any;
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ data, setShowAlertMessage }) => {
  const { selectedChat }: { selectedChat: ChatType } = useCustomSelector(
    (state) => state.chats
  );
  const { showProfile, showSettings } = useCustomSelector((state) => state.utilitySlices)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  //@ts-ignore
  const [userDetails, setUserDetails] = useState<UserType>({})

  useEffect(() => {
    //@ts-ignore
    setUserDetails(() => {
      return { ...data, name: showProfile ? chatInfo(selectedChat, loggedInUser).name : data.name };
    })
  }, [showProfile, showSettings, isEditing])

  const inputRef = useRef<HTMLInputElement>()
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const dispatch = useAppDispatch()


  const handleFilePreivew = (file: any) => {
    const fileUrl = URL.createObjectURL(file);
    setImagePreview(fileUrl);
  };

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFilePreivew(file);
    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const dataURL = e.target.result;
        userDetails.image = dataURL;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      dispatch(setIsError(true));
    }
  };

  const handleChange = (e: any) => {
    setUserDetails((old) => {
      return { ...old, [e.target.name]: e.target.value }
    })
  }


  const handleSaveChanges = async () => {
    dispatch(handleLoading(true))
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-profile`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...userDetails, file: imagePreview ? userDetails.image : null }) })
      const data = await response.json()
      setShowAlertMessage(true)
    } catch (err) {
      dispatch(setIsError(true))
    }
    dispatch(handleLoading(false))
    setIsEditing(false)
  }

  const handleInputClick = () => {
    if (!isEditing) return;
    inputRef.current?.click()
  }

  return (
    <>
      <div className={styles.profile_pic} onClick={handleInputClick}>
        <img src={isEditing ? imagePreview ? imagePreview : userDetails.image : data.image} alt="" />
        <input accept="image/*" style={{ display: "none" }} type="file" onChange={handleUpload} ref={inputRef} />
        {isEditing && <IoMdAdd />}
      </div>
      <div className={styles.details}>
        <div className={styles.part_one}>

          {!isEditing && <h4>{userDetails.name}</h4>}

          {isEditing && (
            <div className={styles.component}>
              <span>Name</span>
              {isEditing ? <Input name="name" onChange={handleChange} value={userDetails.name} /> : <span>{data.name}</span>}
            </div>
          )}


          {selectedChat.isGroupChat && !showSettings ? null : (
            <div className={styles.component}>
              <span>Email</span>
              <span>{data.email}</span>
            </div>
          )}

          {!selectedChat.isGroupChat || showSettings && !isEditing ? <div className={styles.component}>
            <span>Last seen</span>
            <span>{
              //@ts-ignore
              formatLastSeen(userDetails.lastSeen)}</span>
          </div> : null}

          <div className={styles.component}>
            <span>{selectedChat.isGroupChat && !showSettings ? "Description" : "About"}</span>
            {isEditing ? <Input name="slogan" onChange={handleChange} value={userDetails.slogan} /> : <span>
              {selectedChat.isGroupChat && !showSettings
                ? selectedChat.description
                : data.slogan}
            </span>}
          </div>
        </div>
      </div>

      {!showProfile ? isEditing ? <div style={{ margin: "20px 0px", display: "flex", width: "100%", gap: "10px" }}>
        <Button style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "500", marginTop: "10px", background: "var(--lighter-highlight-background)" }} children="Save changes" onClick={() => { setIsEditing(!isEditing); handleSaveChanges() }} />
        <Button style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "500", marginTop: "10px", background: "var(--lighter-background)" }} children="Cancle"
          onClick={() => { setIsConfirmed(true) }} />
      </div> :
        <Button style={{ width: "100%", padding: "14px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "500", marginTop: "10px", background: "var(--lighter-background)" }} children="Edit profile" onClick={() => setIsEditing(!isEditing)} /> : null}

      {isConfirmed && <ConfirmDialog
        heading="Discard changes?"
        body="Are you sure you want to discard changes?"
        btnText="Discard changes" onConfirm={() => { setIsEditing(false); setIsConfirmed(false) }} onCancle={() => setIsConfirmed(false)} />}

    </>
  );
};

export default ProfileDetails;
