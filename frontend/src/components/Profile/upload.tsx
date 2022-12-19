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
      console.log("upload succesfully")
    })
    .catch((err) => {
      console.log(err)
    })
    setFile(undefined)
  }

  return (
    <div className="upload">
      <input type="file" onChange={selectFile}></input>
      <button
        disabled={!file}
        onClick={upload}
      >
        Upload
      </button>
    </div>
  )
};

export default FileUpload;
