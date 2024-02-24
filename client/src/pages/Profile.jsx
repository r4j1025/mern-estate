import React from 'react'
import {useSelector} from 'react-redux';

const Profile = () => {
  const {currentUser} = useSelector(state=>state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7' >Profile</h1>
      <form className='flex gap-4 flex-col' >
        <img className='rounded-full self-center mt-2 cursor-pointer h-24 w-24 object-cover' src={currentUser.avatar} />
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

export default Profile