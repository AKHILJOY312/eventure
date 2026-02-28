// src/presentation/redux/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "../slice/authSlice";

// import userReducer from "../slice/userSlice";
import taskReducer from "../slice/taskSlice";
import uiReducer from "../slice/uiSlice";
import boardReducer from "../slice/boardSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  board: boardReducer,
  // user: userReducer,
  task: taskReducer,
});

// Type root reducer BEFORE wrapping with persistReducer
export type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui"],
};

// Now wrap
const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
