import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';

const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [formData,setFormData] = useState({
        imageUrls:[],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading,setUploading] = useState(false);

    const handleImgSubmit = (e) =>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = []; //wait for one by one upload of images to the storage as async behaviour, so we are returning more than one promise.
            for (let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i])); //by using 'return' inside storeImage func, we can use the result of that func here.
                //So all the 'downloadUrls' will be stored inside the 'promises'.
                Promise.all(promises).then((urls)=>{  //.all for to wait for all the 'promises' and bring them together.
                    setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)}); //storing the new urls from promises.
                    setImageUploadError(false);
                    setUploading(false);

                }).catch((err)=>{
                    setImageUploadError('Image upload failed (2mb max per image)');
                    setUploading(false);
                });
            }
        }else{
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    }
    const storeImage = async (file) =>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done.`)
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) =>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i)=> i!==index),
        })
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7' >Create a Listing</h1>
        <form className='flex gap-4 flex-col sm:flex-row'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' id='name' maxLength='62' required minLength='10' placeholder='Name' className='border p-3 rounded-lg'/>
                <textarea type='text' id='description' maxLength='300' required  placeholder='Description' className='border p-3 rounded-lg'/>
                <input type='text' id='address' required placeholder='Address' className='border p-3 rounded-lg'/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'  />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'  />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'  />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'  />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'  />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6' >
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bedrooms' min='1' max='10' required  />
                    <p>Bedrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bathrooms' min='1' max='10' required  />
                    <p>Bathrooms</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='regularPrice' min='1' max='10' required  />
                    <div className='flex flex-col items-center'>
                    <p>Regular price</p>
                    <span className='text-xs' >($ / Month)</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='discountPrice' min='1' max='10' required  />
                    <div className='flex flex-col items-center'>
                    <p>Discount price</p>
                    <span className='text-xs' >($ / Month)</span>
                    </div>
                </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold' >Images:<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span></p>
                <div className='flex gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border rounded w-full ' type='file' id='images' accept='image/*' multiple />
                    <button type='button' disabled={uploading} onClick={handleImgSubmit} className='p-3 text-green-700 disabled:opacity-80 border uppercase hover:shadow-lg rounded border-green-700'>{uploading?"Uploading...":"Upload"}</button>
                </div>
                <p className='font-semibold text-sm text-red-700'>{imageUploadError && imageUploadError }</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((urls,index)=>(
                        <div key={urls} className='flex justify-between p-3 border items-center'>
                       <img src={urls} alt='listing img' className='w-20 h-20 object-contain rounded-lg' />
                       <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                       </div>
                    ))
                }
                <button className='text-white p-3 rounded-lg disabled:opacity-80 hover:opacity-80 bg-slate-700 uppercase' >Create listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing