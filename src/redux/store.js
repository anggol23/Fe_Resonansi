import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice"; 

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// ⬇️ Bungkus rootReducer dengan persistReducer
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user"], // hanya user yang dipersist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
