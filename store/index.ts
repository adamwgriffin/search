import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./application/applicationSlice";
import errorReducer from "./error/errorSlice";
import userReducer from "./user/userSlice";
import { listingDetailApi } from "./listingDetailApi/listingDetailApi";

export function makeStore() {
  return configureStore({
    reducer: {
      application: applicationReducer,
      error: errorReducer,
      user: userReducer,
      [listingDetailApi.reducerPath]: listingDetailApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(listingDetailApi.middleware)
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
