import React from 'react'

const CreateListing = () => {
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
                    <input className='p-3 border rounded w-full ' type='file' id='images' accept='image/*' multiple />
                    <button className='p-3 text-green-700 disabled:opacity-80 border uppercase hover:shadow-lg rounded border-green-700'>Upload</button>
                </div>
                <button className='text-white p-3 rounded-lg disabled:opacity-80 hover:opacity-80 bg-slate-700 uppercase' >Create listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing