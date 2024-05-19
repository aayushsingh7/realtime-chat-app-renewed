import { FC } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { GrZoomIn, GrZoomOut } from "react-icons/gr";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import ReactPlayer from "react-player";
import {
    TransformComponent,
    TransformWrapper
} from "react-zoom-pan-pinch";
import Button from "../components/Button";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import { handleViewFile } from "../slice/utilitySlices";
import styles from "../styles/ViewFile.module.css";
import donwloadFile from "../utils/donwloadFile";

interface ViewFileProps { }

const ViewFile: FC<ViewFileProps> = () => {
    const data = useCustomSelector((state) => state.chats.viewMessage);
    const dispatch = useAppDispatch()


    return (
        <div className={styles.container}>
            <TransformWrapper>
                {({ zoomIn, zoomOut, ...rest }) => (
                    <>
                        <div className={styles.header}>
                            <div className="flex">
                                <Button
                                    style={{
                                        width: "50px",
                                        height: "45px",
                                        background: "var(--light-background)",
                                        marginRight: "10px",
                                        borderRadius: "10px",
                                        flexShrink: "0",
                                    }}
                                    onClick={() => dispatch(handleViewFile(false))}
                                    children={
                                        <BsArrowLeft
                                            style={{
                                                color: "var(--primary-text-color)",
                                                padding: "7px",
                                                fontSize: "38px",
                                            }}
                                        />
                                    }
                                />
                                <p
                                    style={{
                                        color: "var(--primary-text-color)",
                                        fontSize: "0.8rem",
                                        marginLeft: "15px",
                                    }}
                                >
                                    {data.fileName}
                                </p>
                            </div>
                            <ul>
                                {data.msgType.includes("image") && (
                                    <>
                                        <li>
                                            <Button
                                                onClick={() => zoomIn()}
                                                style={{
                                                    width: "50px",
                                                    height: "45px",
                                                    background: "var(--light-background)",
                                                    marginRight: "10px",
                                                    borderRadius: "10px",
                                                    flexShrink: "0",
                                                }}
                                                children={
                                                    <GrZoomIn
                                                        style={{
                                                            color: "var(--primary-text-color)",
                                                            padding: "7px",
                                                            fontSize: "38px",
                                                        }}
                                                    />
                                                }
                                            />
                                        </li>
                                        <li>
                                            <Button
                                                onClick={() => zoomOut()}
                                                style={{
                                                    width: "50px",
                                                    height: "45px",
                                                    background: "var(--light-background)",
                                                    marginRight: "10px",
                                                    borderRadius: "10px",
                                                    flexShrink: "0",
                                                }}
                                                children={
                                                    <GrZoomOut
                                                        style={{
                                                            color: "var(--primary-text-color)",
                                                            padding: "7px",
                                                            fontSize: "38px",
                                                        }}
                                                    />
                                                }
                                            />
                                        </li>
                                    </>
                                )}

                                {/* <li>
                  <Button
                    onClick={() =>
                      dispatch(starMessages({ messageIds: [data._id] }))
                    }
                    style={{
                      width: "50px",
                      height: "45px",
                      background: "var(--light-background)",
                      marginRight: "10px",
                      borderRadius: "10px",
                      flexShrink: "0",
                    }}
                    children={
                      <FaRegStar
                        style={{
                          color: "var(--primary-text-color)",
                          padding: "7px",
                          fontSize: "38px",
                        }}
                      />
                    }
                  />
                </li> */}
                                {/* <li>
                  <Button
                  onClick={() => setShowEmojis(true)}
                    style={{
                      width: "50px",
                      height: "45px",
                      background: "var(--light-background)",
                      marginRight: "10px",
                      borderRadius: "10px",
                      flexShrink: "0",
                    }}
                    children={
                      <FaRegSmileBeam
                        style={{
                          color: "var(--primary-text-color)",
                          padding: "7px",
                          fontSize: "38px",
                        }}
                      />
                    }
                  />
                </li> */}
                                <li>
                                    <Button
                                        onClick={() => donwloadFile(data)}
                                        style={{
                                            height: "45px",
                                            background: "var(--light-background)",
                                            marginRight: "10px",
                                            borderRadius: "10px",
                                            flexShrink: "0",
                                            fontSize: "0.8rem",
                                            padding: "20px",
                                        }}
                                        children="Donwload"
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className={styles.content}>
                            <Button
                                style={{
                                    width: "50px",
                                    height: "45px",
                                    background: "var(--light-background)",
                                    borderRadius: "10px",
                                    flexShrink: "0",
                                    left: "1%",
                                    zIndex: "3",
                                }}
                                children={
                                    <MdArrowBackIosNew
                                        style={{
                                            color: "var(--primary-text-color)",
                                            padding: "7px",
                                            fontSize: "38px",
                                        }}
                                    />
                                }
                            />

                            {/* {data.msgType.includes("video") ? (

                            ): null} */}

                            <TransformComponent>
                                {data.msgType.includes("video") ? <ReactPlayer
                                    url={data.message}
                                    controls
                                    height={"100%"}
                                    width={"auto"}
                                    disablePictureInPicture
                                    playing={true}
                                    muted={false}
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: "nodownload noplaybackrate nofullscreen",
                                                disablePictureInPicture: true,
                                            },
                                        },
                                    }}
                                /> : data.msgType.includes(
                                    "image"
                                ) ? (
                                    <img src={data.message} alt="image" />
                                ) : null}
                            </TransformComponent>

                            <Button
                                style={{
                                    width: "50px",
                                    height: "45px",
                                    background: "var(--light-background)",
                                    borderRadius: "10px",
                                    flexShrink: "0",
                                    right: "1%",
                                    zIndex: "3",
                                }}
                                children={
                                    <MdArrowForwardIos
                                        style={{
                                            color: "var(--primary-text-color)",
                                            padding: "7px",
                                            fontSize: "38px",
                                        }}
                                    />
                                }
                            />
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default ViewFile;
