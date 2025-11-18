import { FC } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { PiImageLight } from "react-icons/pi";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { handleShowProfile } from "../slice/utilitySlices";
import styles from "../styles/MediaAndFiles.module.css";
import { MediaFilesTypes } from "../types/types";
import scrollToMessage from "../utils/scrollToMessage";


interface MediaAndFilesProps {
  data: MediaFilesTypes[];
  elemPerRow: number;
  heading: boolean;
}

const MediaAndFiles: FC<MediaAndFilesProps> = ({
  data,
  elemPerRow,
  heading,
}) => {

  const dispatch = useAppDispatch()
  return (
    <div
      className={styles.part_two}
      style={{
        marginTop: heading ? "10px" : "0px",
        borderTop: heading ? "1px solid var(--lighter-background)" : "none",
      }}
    >
      {heading && <p>Media & Files</p>}
      {data.length === 0 ? (
        <div className={styles.temp}>
          <PiImageLight />
          <span>No Media & Files Shared Yet.</span>
        </div>
      ) : (
        <ul
          className={styles.dddd}
          style={{
            gridTemplateColumns: `repeat(${elemPerRow}, minmax(0, 1fr))`,
            maxHeight: "180px",
            overflowY: "scroll",

          }}
        >
          {data.map((file) => {

            return (
              <li onClick={() => { scrollToMessage(file._id, styles.selected); dispatch(handleShowProfile(false)) }}>
                {file.document ?
                  <FileIcon
                    extension={file.extension}
                    {...defaultStyles[file.extension]}
                  />
                  : file?.msgType?.includes("image") ?
                    <img src={file.message} alt="" /> :
                    file.msgType.includes("video") ?
                      <video src={file.message} ></video> :
                      null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MediaAndFiles;
