import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import dataReducer from './features/data/dataSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer,
        data: dataReducer,
    }
  })
}