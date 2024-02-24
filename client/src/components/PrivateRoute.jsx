import React from 'react';
import {useSelector} from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
// Navigate is a component. If user not exist, then send them to sign-in page.


const PrivateRoute = () => {
    const {currentUser} = useSelector(state=>state.user)

  return (
    currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
  ) // Outlet renders the child route's element. 
}

export default PrivateRoute 