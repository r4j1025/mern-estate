import { useRef, useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {
  const {currentUser} = useSelector(state=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined); //storing the first file selected by the user inside 'file'.
  const [filePerc, setfilePerc] = useState(0); // state for storing percentage of file upload.
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});

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


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7' >Profile</h1>
      <form className='flex gap-4 flex-col' >
        <input onChange={(e)=>setFile(e.target.files[0])} accept='image/*' hidden type='file' ref={fileRef} />
        <img onClick={()=>fileRef.current.click()} className='rounded-full self-center mt-2 cursor-pointer h-24 w-24 object-cover' src={formData.avatar || currentUser.avatar} /> 
        <p className='text-sm text-center'>
          {fileUploadError ? (<span className='text-red-700'>Uploading error! (image must be less than 2mb)</span>) : filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) : filePerc === 100 ? (<span className='text-green-700'>Image successfully uploaded!</span>):"" }
        </p>
        <input type='text' id='username' placeholder='username' className='border p-3 rounded-lg'/>
        <input type='text' id='email' placeholder='email' className='border p-3 rounded-lg'/>
        <input type='text' id='password' placeholder='password' className='border p-3 rounded-lg'/>
        <button className='uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80' >update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' >Delete account</span>
        <span className='text-red-700 cursor-pointer' >Sign out</span>
      </div>
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