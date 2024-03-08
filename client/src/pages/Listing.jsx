import React, { useEffect,useState } from 'react'
import {useParams} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkedAlt,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from 'react-icons/fa';


const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setlisting] = useState(null);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    useEffect(()=>{
        const fetchListing = async () =>{
            try {
                setloading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false){
                    seterror(true);
                    setloading(false);
                    return;
                }
                setlisting(data);
                setloading(false);
                seterror(false);
            } catch (error) {
                seterror(true);
                setloading(false);
            }
        }
        fetchListing();
    },[params.listingId]); // runs each time when params.listingId changes. 
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl text-red-700'>Something went wrong!</p>}
        {listing && !loading && !error && (
            <div>
            <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ><img src={url}/></div>
              </SwiperSlide>
            ))}
          </Swiper>
            </div>
        )}
    
    </main>
  )
}

export default Listing