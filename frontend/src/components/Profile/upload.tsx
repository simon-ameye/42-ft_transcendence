import { useState, useEffect } from "react";
import IFile from "./Interface/FileInterface";
import UploadService from "./FileUploadService";
import './style.scss'

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
        window.location.reload();
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
        Click to browse
      </label>
      <button
        disabled={!file}
        onClick={upload}
        className="upload-btn"
      >
        Upload
      </button>
    </div>
  )
};

export default FileUpload;
