import { useRef, useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../redux/User/userSlice.js';



const Profile = () => {
  const {currentUser,loading, error} = useSelector(state=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined); //storing the first file selected by the user inside 'file'.
  const [filePerc, setfilePerc] = useState(0); // state for storing percentage of file upload.
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch(); 
  const [updateSuccess, setupdateSuccess] = useState(false);

  useEffect(()=>{
    if (file){
      handleFileUpload(file);
    }
  },[file]); // means if there is something inside the file call this function

  const handleFileUpload = (file) =>{
    const storage = getStorage(app); // here app refers to the firebase.jsx
    const fileName = new Date().getTime() + file.name; //date was appended to make the file name unique.
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);// used to see the percentage of upload.

    uploadTask.on('state_changed',     //snapshot is piece of info from each state change.
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100; // getting percentage of transfered data.
        setfilePerc(Math.round(progress));
      },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then( //getting the download url of the image if the upload was success and storing the url in the formData
        (downloadURL)=>{
          setFormData({...formData, avatar:downloadURL});
        }
      );
    }
    );
  }

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.id] : e.target.value});
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method : 'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });

      const data = await res.json(); //this is the res received for the above request.
      if (data.success === false){
        dispatch(updateUserFailure(data.message));
        return;                       /////// return is used to avoid executing the next line.
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }


  const handleSignout = async ()=>{
    try {
      dispatch(signoutUserStart())
      const res= await fetch("/api/auth/signout");
      const data =await res.json();

      if (data.success === false){
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(data.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7' >Profile</h1>
      <form onSubmit={handleSubmit} className='flex gap-4 flex-col' >
        <input onChange={(e)=>setFile(e.target.files[0])} accept='image/*' hidden type='file' ref={fileRef} />
        <img onClick={()=>fileRef.current.click()} className='rounded-full self-center mt-2 cursor-pointer h-24 w-24 object-cover' src={formData.avatar || currentUser.avatar} /> 
        <p className='text-sm text-center'>
          {fileUploadError ? (<span className='text-red-700'>Uploading error! (image must be less than 2mb)</span>) : filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) : filePerc === 100 ? (<span className='text-green-700'>Image successfully uploaded!</span>):"" }
        </p>
        <input onChange={handleChange} defaultValue={currentUser.username} type='text' id='username' placeholder='username' className='border p-3 rounded-lg'/>
        <input onChange={handleChange} defaultValue={currentUser.email} type='text' id='email' placeholder='email' className='border p-3 rounded-lg'/>
        <input onChange={handleChange} type='password' id='password' placeholder='password' className='border p-3 rounded-lg'/>
        <button disabled={loading} className='uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80' >{loading? 'loading...':'update'}</button>
      </form>
      <div className='flex font-semibold justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer' >Delete account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer' >Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error?<span>{error}</span> : updateSuccess ? <span className='text-green-700'>User is successfully updated!</span>:"" }</p>
    </div>
  )
}
// The below rule was configured inside the firebase rules tab to accept images less than 2mb.
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write:if
//       request.resource.size < 2*1024*1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }

export default Profile