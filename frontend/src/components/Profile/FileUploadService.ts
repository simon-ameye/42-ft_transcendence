import axios from 'axios';

const upload = (file: File): Promise<any> => {
  let formData = new FormData();

  formData.append("file", file);

  return axios.post("http://localhost:3001/profile/uploadImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getFiles = () : Promise<any> => {
  return axios.get("http://localhost:3001/profile/getImage");
};

const FileUploadService = {
  upload,
  getFiles,
};

export default FileUploadService;
