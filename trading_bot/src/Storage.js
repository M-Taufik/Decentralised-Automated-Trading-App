import {configureStore} from '@reduxjs/toolkit'
import profileReducer from "@/Profile"

export default configureStore({
        reducer:{
            profile: profileReducer
        }

})