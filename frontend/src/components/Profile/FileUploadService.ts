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

const getFile = () : Promise<any> => {
  return axios.get("http://localhost:3001/profile/getImage");
};

const FileUploadService = {
  upload,
  getFile,
};

export default FileUploadService;
