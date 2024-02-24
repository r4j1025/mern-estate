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
    },
});

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;
// making it like the above three funcs are coming from the userSlice.actions
export default userSlice.reducer;