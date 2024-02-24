import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import {useDispatch} from 'react-redux';
import {signInSuccess } from '../redux/User/userSlice.js';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () =>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);;
            const result = await signInWithPopup(auth,provider); // result contains all the google data of user
            const res =  await fetch('/api/auth/google', {
              method:'POST',
              headers:{
                'Content-Type':'application/json',
              },
              body: JSON.stringify({name:result.user.displayName,email: result.user.email ,photo :result.user.photoURL}),
              // sending the above three info to the above mentioned endpoint. that is auth.controller.jsx
            });
            const data = await res.json()//response for the post request.
            dispatch(signInSuccess(data));
            navigate('/');
          } catch (error) {
            console.log("Could not sign in with Google",error);
        }
    }

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90 ' >continue with google</button> //typ=button to avoid the submition of the form
  )
}

export default OAuth