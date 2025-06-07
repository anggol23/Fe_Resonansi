import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const initialState = {
  currentUser: null,
  token: localStorage.getItem("access_token") || null, 
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.access_token || null;
      state.loading = false;
      state.error = null;
      
      if (action.payload.access_token) {
        localStorage.setItem("access_token", action.payload.access_token);
      }
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("access_token");
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("access_token");
    },
  },
});

// ✅ Ekspor action secara eksplisit
export const { 
  signInStart, 
  signInSuccess, 
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess 
} = userSlice.actions;

// ✅ Setup Redux Persist
const persistConfig = {
  key: "user",
  storage,
  version: 1,
  whitelist: ["currentUser", "token"],
};

// ✅ Pastikan ekspor dilakukan dengan default
const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer);
export default persistedUserReducer;
