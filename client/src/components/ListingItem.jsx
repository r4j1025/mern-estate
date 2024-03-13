import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md';
//.toLocaleString('en-US')  to add comma for price values.

const ListingItem = ({listing}) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
            <img className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' src={listing.imageUrls[0] || "https://media.assettype.com/outlookbusiness%2F2023-10%2Fb0d05f17-546c-4c46-b85d-f7e1129068f4%2F10_Companies_That_Hire_for_Remote_Real_Estate_Jobs.jpg"} alt='listing cover' />
        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='text-lg border-b-2  border-slate-200 font-semibold truncate text-slate-700 '>{listing.name}</p>
            <div className='flex  items-center gap-1'>
                <MdLocationOn
                    className='h-4 w-4 text-green-700 '
                />
                <p className='truncate w-full text-sm text-gray-600'>{listing.address}</p>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
            <p className=' mt-2 font-semibold  text-slate-500'>₹{listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {' '}
                {listing.type === "rent" && '/ month'}
            </p>
            <div className= 'flex gap-4 text-slate-700'>
                <div className='font-bold text-xs'>{listing.bedrooms >1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed` }</div>
                <div className='font-bold text-xs'>{listing.bathrooms >1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom` }</div>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default ListingItem