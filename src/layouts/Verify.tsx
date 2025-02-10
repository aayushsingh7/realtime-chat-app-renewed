import { FC, useEffect, useState } from "react";
import { PiWechatLogoFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchChats } from "../slice/chatSlice";
import { setUser } from "../slice/userSlice";
import { handleAskPermission, setIsError, setVerify } from "../slice/utilitySlices";
import { UserType } from "../types/types";
import Button from "../components/Button";

interface VerifyProps { }

const Verify: FC<VerifyProps> = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const isNotificationPermissionExists = localStorage.getItem("isNotificationPermitted")

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true)
    }, 5000)
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticate`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { user }: { user: UserType } = await response.json();
      if (response.status === 200) {
        dispatch(setUser(user));
        //@ts-ignore
        dispatch(fetchChats(user._id));
        dispatch(setVerify(false));
        if (!isNotificationPermissionExists) {
          dispatch(handleAskPermission(true))
        }
      } else {
        navigate("/login");
        dispatch(setVerify(false));
      }
    } catch (err: any) {
      dispatch(setVerify(false));
      dispatch(setIsError(true));
    }
  };

  return (
    <div className="verifying">
      <div>
        <PiWechatLogoFill />
        {showMessage &&
          <div className="verifying-message flex">
            <p>Free hosted servers may take unnecessary time to respond, reloading page may help</p>
            <Button children="Reload page" style={{ fontSize: "0.8rem", fontWeight: "500", padding: "10px 25px", background: "var(--highlight-text-color)", color: "var(--primary-dark-background)", marginTop: "16px", borderRadius: "6px" }} onClick={() => location.reload()} />
          </div>}
      </div>
    </div>
  );
};

export default Verify;
