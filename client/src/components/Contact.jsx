import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';

const Contact = ({listing}) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    },[listing.userRef]);

    const onChange =(e)=>{
        setMessage(e.target.value);
    }
  return (
    <>
        {landlord && (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea placeholder='Enter your message here...' className='w-full border border-slate-600 p-3 rounded-lg' onChange={onChange} name='message' id='message' value={message} rows='2'></textarea>
                <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-85' to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
            </div>
        )}
    </>
  )
}

export default Contact