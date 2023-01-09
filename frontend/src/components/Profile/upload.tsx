import { useState, useEffect } from "react";
import IFile from "./Interface/FileInterface";
import UploadService from "./FileUploadService";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File>();

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null)
      setFile(event.target.files[0])
  }

  const upload = () => {
    if (!file)
      return;
    UploadService.upload(file)
    .then((file) => {
      alert("Upload Done, please refresh")
    })
    .catch((err) => {
      alert("Upload failed")
    })
    setFile(undefined)
  }

  return (
    <div className="upload">
      <label className="custom-file-upload">
        <input type="file" onChange={selectFile}></input>
        browse
      </label>
      <button
        disabled={!file}
        onClick={upload}
        className=""
      >
        Upload
      </button>
    </div>
  )
};

export default FileUpload;
