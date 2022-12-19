import Navbar from '../Navbar';
import { useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'


const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [imageFile, setImageFile] = useState()
  const [imageUrl, setImageUrl] = useState<string>()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(); 
    if (imageFile === undefined)
      return;
    formData.append("image", imageFile!) // dangerous
    //console.log(userProfilePicture)
    try {
      const response = await axios({
        method: "post",
        url: "localhost:3001/profile/uploadImage",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch(error) {
      console.log(imageFile)
    }
  }

  function getProfileInterface() {
    axios.get('http://localhost:3001/profile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }
  
 /* function getProfileImage() {
    axios.get('http://localhost:3001/profile/getImage', {
    }).then(
      function (response) {
        setUserProfilePicture(response.data)
      }).catch(err => console.log(err));
  }*/

  useEffect(() => {
    getProfileInterface()
  }, [])

  /*useEffect(() => {
    getProfileImage()
  }, [])*/

  return (
    <div className='profile'>
      <Navbar />
      {/* <div className='email'>{profileInterface?.email}</div> */}
      {/* <div className='displayName'>{profileInterface?.displayName}</div> */}
      {/* <div className='profileImage'> profile image : {userProfilePicture}</div> */}
      {/* <div>matching: {profileInterface?.matching}</div> */}
      {/* <div>inGame: {profileInterface?.inGame}</div> */}
      {/* <div>victories: {profileInterface?.victories}</div> */}
      {/* <div>log: {profileInterface?.log}</div> */}
      {/* <div>friends: {profileInterface?.friends}</div> */}
      {/* <div>blockedUserIds: {profileInterface?.blockedUserIds}</div> */}
      <form onSubmit={handleSubmit}>
      <input
        type="file"
        value={imageFile || ''}
        onChange={(e) => setImageFile(e.target.value)}
      />
        { <label className="upload" htmlFor="image">Upload profile picture</label> }
        { <button type="submit" className='submit-btn'>submit</button> }
      </form>
    </div>
  )
}

export default Profile;