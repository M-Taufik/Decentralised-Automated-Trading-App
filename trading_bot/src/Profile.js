import {createSlice} from '@reduxjs/toolkit'


const profileSlice = createSlice({
        name: "profile",
        initialState: {
            name: "No wallet",
        },
        reducers: {
            SET_WALLET(state, action){
                state.wallet = action.payload
            }
        }

})

export const {SET_WALLET} = profileSlice.actions

export default profileSlice.reducer