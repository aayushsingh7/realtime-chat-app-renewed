import { FC, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import {
  IoCallOutline,
  IoChatbubbleEllipsesOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { LuCircleDashed } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { handleShowChats, handleShowStarredMessages } from "../slice/chatSlice";
import { handleLoading, handleShowSettings, setIsError } from "../slice/utilitySlices";
import styles from "../styles/SideNavbar.module.css";
import sendNotification from "../utils/sendNotification";
import ConfirmDialog from "./ConfirmDialog";
import { handleLogout, setUser } from "../slice/userSlice";
import { useCustomSelector } from "../hooks/useCustomSelector";

interface SideNavbarProps { }

const SideNavbar: FC<SideNavbarProps> = () => {
  const dispatch = useAppDispatch();
  const confirmLogout = useCustomSelector((state) => state.user.confirmLogout)
  const navigate = useNavigate()

  const logout = async () => {
    dispatch(handleLogout(false))
    dispatch(handleLoading(true))
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      dispatch(setUser({}))
      localStorage.removeItem("isNotificationPermitted")
      localStorage.removeItem("notification_permission_asked_on")
      localStorage.removeItem("notification_settings")
      dispatch(handleLoading(false))
      navigate("/login")
    } catch (err) {
      dispatch(setIsError(true))
    }
  }


  return (
    <>
      {confirmLogout && <ConfirmDialog heading="Confirm Logout?"
        body="Are you sure you want to Logout" btnText="Logout" onCancle={() => dispatch(handleLogout(false))} onConfirm={logout} />}
      <div className={styles.container}>
        <div className={styles.part_one}>
          <Link
            to={"/"}
            onClick={() => { dispatch(handleShowStarredMessages(false)); dispatch(handleShowChats(true)) }}
          >
            <IoChatbubbleEllipsesOutline className={styles.active} />
          </Link>
          <IoCallOutline onClick={() => sendNotification("New Message!", "Aayush singh: hello bhai kya kar raha hai tu??", "new message", "http://localhost:5173/chat/6637dcefe84f7ef2cd4424a2")} />
          <LuCircleDashed />
        </div>

        <div className={styles.part_two}>
          <FaRegStar onClick={() => dispatch(handleShowStarredMessages(true))} />
          <IoSettingsOutline onClick={() => dispatch(handleShowSettings(true))} />
          <MdLogout onClick={() => dispatch(handleLogout(true))} />
          {/* <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhQbHQsVC35TbO7Oc8znjarPf3xilpfCVVkiOnK3Uqmw&s"
          alt="profile"
          onClick={() => dispatch(handleShowSettings(true))}
        /> */}
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
