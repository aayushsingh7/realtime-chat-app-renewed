import { FC, useRef, useState } from "react";
import {
  IoHelpCircleOutline,
  IoNotificationsOutline
} from "react-icons/io5";
import { LuPencil, LuUser } from "react-icons/lu";
import Button from "../components/Button";
import ProfileDetails from "../components/ProfileDetails";
import { useCustomSelector } from "../hooks/useCustomSelector";
import styles from "../styles/Settings.module.css";
import { Notification_Settings, UserType } from "../types/types";

import {
  MdOutlineColorLens,
  MdOutlineDarkMode,
  MdOutlineLightMode
} from "react-icons/md";

interface SettingsProps { }

const Settings: FC<SettingsProps> = () => {

  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const [selectedTab, setSelectedTab] = useState(1);
  const [notification_settings, setNotification_settings] = useState<Notification_Settings>(JSON.parse(localStorage.getItem("notification_settings") || '{}'))
  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(false)

  const editNotificationSettings = (fieldName: string, value: boolean) => {
    console.log(fieldName)
    const updatedSettings = {
      ...notification_settings,
      [fieldName]: value
    };
    localStorage.setItem("notification_settings", JSON.stringify(updatedSettings));
    setNotification_settings(updatedSettings)

  };


  return (
    <div className={styles.container}>
      <div className={styles.tabs_container}>
        <Button
          onClick={() => setSelectedTab(1)}
          style={{
            width: "100%",
            padding: "10px",
            background:
              selectedTab === 1
                ? "var(--light-background)"
                : "var(--secondary-background)",
          }}
          children={
            <>
              <LuUser style={{ marginRight: "10px", fontSize: "20px" }} />
              <span>Profile</span>
            </>
          }
        />



        <Button
          onClick={() => setSelectedTab(3)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "4px",
            background:
              selectedTab === 3
                ? "var(--light-background)"
                : "var(--secondary-background)",
          }}
          children={
            <>
              <IoNotificationsOutline
                style={{ marginRight: "10px", fontSize: "20px" }}
              />
              <span>Notifications</span>
            </>
          }
        />

        <Button
          onClick={() => setSelectedTab(4)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "4px",
            background:
              selectedTab === 4
                ? "var(--light-background)"
                : "var(--secondary-background)",
          }}
          children={
            <>
              <LuPencil style={{ marginRight: "11px", fontSize: "19px" }} />
              <span>Personalization</span>
            </>
          }
        />

        <Button
          onClick={() => setSelectedTab(5)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "4px",
            background:
              selectedTab === 5
                ? "var(--light-background)"
                : "var(--secondary-background)",
          }}
          children={
            <>
              <IoHelpCircleOutline
                style={{ marginRight: "9px", fontSize: "21px" }}
              />
              <span>Help</span>
            </>
          }
        />
      </div>
      <div
        className={styles.selected_tab}
        style={{
          padding:
            selectedTab == 3 || selectedTab == 4
              ? "20px 0px 20px 20px"
              : "20px",
        }}
      >
        {selectedTab == 1 ? (
          <div className={styles.tab}>
            {showAlertMessage && <p className={styles.alert_message}>Change will be applied after a page reload</p>}
            <h2 className={styles.m_b}>Profile</h2>
            <ProfileDetails data={loggedInUser} setShowAlertMessage={setShowAlertMessage} />
          </div>
        ) : selectedTab === 3 ? (
          <div className={styles.tab}>
            <h2>Notifications</h2>
            <div className={styles.options}>
              <div className={styles.parts}>
                <div>
                  <p>Messages</p>
                  <span>Receive notfications on new message</span>
                </div>
                <Button
                  onClick={() => editNotificationSettings("messages_notifications", !notification_settings.messages_notifications)}
                  style={{
                    padding: "5px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: notification_settings.messages_notifications ?
                      "var(--highlight-background)" : "var(--lighter-background)",
                    width: "100px",
                  }}
                  children={notification_settings.messages_notifications ? "On" : "Off"}
                />
              </div>

              <div className={styles.parts}>
                <div>
                  <p>Reactions</p>
                  <span>Receive notfications on new reactions</span>
                </div>
                <Button
                  onClick={() => editNotificationSettings("react_on_message_notifications", !notification_settings.react_on_message_notifications)}
                  style={{
                    padding: "5px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: notification_settings.react_on_message_notifications ?
                      "var(--highlight-background)" : "var(--lighter-background)",
                    width: "100px",
                  }}
                  children={notification_settings.react_on_message_notifications ? "On" : "Off"}
                />
              </div>

              <div className={styles.parts}>
                <div>
                  <p>Calls</p>
                  <span>Receive notfications on calls</span>
                </div>
                <Button
                  onClick={() => editNotificationSettings("calls_notifications", !notification_settings.calls_notifications)}
                  style={{
                    padding: "5px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: notification_settings.calls_notifications ?
                      "var(--highlight-background)" : "var(--lighter-background)",
                    width: "100px",
                  }}
                  children={notification_settings.calls_notifications ? "On" : "Off"}
                />
              </div>

              <div className={styles.parts}>
                <div>
                  <p>Text Preview</p>
                  <span>
                    Show message preview inside new message notifications
                  </span>
                </div>
                <Button
                  onClick={() => editNotificationSettings("text_preview", !notification_settings.text_preview)}
                  style={{
                    padding: "5px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: notification_settings.text_preview ?
                      "var(--highlight-background)" : "var(--lighter-background)",
                    width: "100px",
                  }}
                  children={notification_settings.text_preview ? "On" : "Off"}
                />
              </div>

              <div className={styles.parts}>
                <div>
                  <p>Media Preview</p>
                  <span>
                    Show media preview images inside new message notifications
                  </span>
                </div>
                <Button
                  onClick={() => editNotificationSettings("media_preview", !notification_settings.media_preview)}
                  style={{
                    padding: "5px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: notification_settings.media_preview ?
                      "var(--highlight-background)" : "var(--lighter-background)",
                    color: "var(--primary-text-color)",
                    width: "100px",
                  }}
                  children={notification_settings.media_preview ? "On" : "Off"}
                />
              </div>
            </div>
          </div>
        ) : selectedTab == 4 ? (
          <div className={styles.tab}>
            <h2>Personalization</h2>
            <div className={styles.options}>
              <div className={styles.parts}>
                <div>
                  <p>Theme</p>
                  <span>App color theme</span>
                </div>
                <Button
                  style={{
                    padding: "8px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    background: "var(--lighter-background)",
                    justifyContent: "flex-start",
                    color: "var(--primary-text-color)",
                    width: "80%",
                  }}
                  children={
                    <>
                      <MdOutlineDarkMode />{" "}
                      <span
                        style={{
                          color: "var(--primary-text-color)",
                          marginLeft: "10px",
                        }}
                      >
                        Dark Mode
                      </span>
                    </>
                  }
                />
                <Button
                  style={{
                    padding: "8px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    borderRadius: "5px",
                    justifyContent: "flex-start",
                    color: "var(--primary-text-color)",
                    background: "var(--lighter-background)",
                    width: "80%",
                  }}
                  children={
                    <>
                      <MdOutlineLightMode />{" "}
                      <span
                        style={{
                          color: "var(--primary-text-color)",
                          marginLeft: "10px",
                        }}
                      >
                        Light Mode <span className="unavailable">Unavailable</span>
                      </span>
                    </>
                  }
                />

                <Button
                  style={{
                    padding: "8px 15px",
                    fontSize: "0.7rem",
                    marginTop: "10px",
                    justifyContent: "flex-start",
                    borderRadius: "5px",
                    background: "var(--lighter-background)",
                    width: "80%",
                  }}
                  children={
                    <>
                      <MdOutlineColorLens />{" "}
                      <span
                        style={{
                          color: "var(--primary-text-color)",
                          marginLeft: "10px",
                        }}
                      >
                        System Default
                      </span>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.tab} ${styles.help}`}>
            <h2>Help</h2>
            <div className={styles.parts}>
              <div>
                <p>ChatVerse For Web.</p>
                <span>Version: 1.1.1</span>
              </div>
            </div>

            <div className={styles.parts}>
              <div>
                <p>Contact Us.</p>
                <span>We'd like to know your thoughts about this app.</span>
                <p
                  style={{
                    color: "var(--lighter-highlight-background)",
                    textDecoration: "underline",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  Email Us
                </p>
              </div>
            </div>

            <div className={styles.parts}>
              <span>2024 © ChatVerse.com</span>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default Settings;
