import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./application/applicationSlice";
import errorReducer from "./error/errorSlice";
import searchStateReducer from "./search/searchSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      application: applicationReducer,
      error: errorReducer,
      search: searchStateReducer
    }
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
