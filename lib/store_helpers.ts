import type { AppDispatch, AppState } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";

// putting this in store/index.ts with the function that creates the store causes a circular dependency error for some
// reason so we're keeping it here instead
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();
