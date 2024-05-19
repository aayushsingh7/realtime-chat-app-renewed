import { FC, useEffect, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { CiFileOff } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import { handleShowPreview, handleShowUploadOption } from "../slice/utilitySlices";
import formatFileSize from "../utils/formatFileSize";
import Button from "./Button";
import Input from "./Input";

interface PreviewProps {
  url: string;
  type: string;
  func: any;
  setCaption: any;
  loadingPreview: boolean;
  fileName?: string;
  fileSize?: number;
  extension?: string;
  selectedFormat?: string;
}

const Preview: FC<PreviewProps> = ({
  extension,
  fileName,
  fileSize,
  func,
  url,
  type,
  setCaption,
  loadingPreview,
  selectedFormat
}) => {
  const handleSubmit = (e: any) => {
    func(e);
  };

  const dispatch = useDispatch()
  const [validFile, setValidFile] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFormat === "Document") {
      if (type.includes("image") || type.includes("video")) {
        setValidFile(false);
      } else {
        setValidFile(true);
      }
    } else if (selectedFormat === "Photos and videos") {
      if (type.includes("image") || type.includes("video")) {
        setValidFile(true);
      } else {
        setValidFile(false);
      }
    }
  }, [selectedFormat, type])

  return (
    <div className="preview_container">
      {fileSize && fileSize > 10000000 || !validFile ?
        <div className="not-available">
          <CiFileOff />
          <div>
            {!validFile ? <p>Invalid File Type.</p> : <p>File size cannot exceed 10 MB</p>}
            <Button onClick={() => { dispatch(handleShowPreview(false)); dispatch(handleShowUploadOption(true)) }} children="Select another file" style={{ padding: "10px", width: "100%", marginTop: "10px", borderRadius: "5px", whiteSpace: "nowrap", background: "var(--highlight-text-color)", fontWeight: "500" }} />
          </div>
        </div> : loadingPreview ?
          <div className="preview-loading flex"><div className="loader"></div><p>This may take a while...</p></div> : <>
            <div className="content_preview">
              {type.includes("image") ? (
                <img src={url} alt="preview" />
              ) : type.includes("video") ? (
                <video src={url}></video>
              ) : (
                <div className="pdf_preview_template">
                  <FileIcon extension={extension} {...defaultStyles[extension]} />
                  <span className="pdf_name">{fileName}</span>
                  <span className="pdf_details">
                    {fileSize && formatFileSize(fileSize)} {"| "}
                    <span style={{ fontWeight: "600" }}>
                      {extension && extension.toUpperCase()}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <div className="options p_10">
              <Input
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={handleSubmit}
                style={{
                  background: "var(--light-background)",
                  padding: "12px",
                  borderRadius: "10px",
                  width: "100%",
                  fontSize: "17px",
                }}
                placeholder="Caption (optional)"
              />

              <Button
                type="submit"
                onClick={handleSubmit}
                style={{
                  width: "50px",
                  height: "45px",
                  background: "var(--highlight-background)",
                  marginLeft: "10px",
                  borderRadius: "10px",
                  flexShrink: "0",
                }}
                children={
                  <IoIosSend
                    style={{
                      color: "var(--primary-text-color)",
                      padding: "7px",
                      fontSize: "38px",
                    }}
                  />
                }
              />
            </div>
          </>}
    </div>
  );
};

export default Preview;
