import { createSlice } from "@reduxjs/toolkit";
//the below things are created for global usage.

const initialState = {
    currentUser : null,
    error: null,
    loading:false,
}

const userSlice = createSlice({   //creating global state named 'user'.
    name : 'user',
    initialState,
    reducers:{
        signInStart : (state) => {
            state.loading=true;
        },
        signInSuccess: (state,action) => {   //action is the data received
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure: (state,action) => {   //action is the data received
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart : (state) =>{
            state.loading = true;
        },
        updateUserSuccess : (state,action) =>{
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        updateUserFailure : (state,action) =>{
            state.error = action.payload;      //action,payload is the res received from the backend.
            state.loading=false;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state)=>{
            state.loading=false;
            state.currentUser = null;  // here making the currentuser's value null.
            state.error = null;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
    },
});

export const {signInStart, signInSuccess, signInFailure,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure} = userSlice.actions;
// making it like the above three funcs are coming from the userSlice.actions
export default userSlice.reducer;