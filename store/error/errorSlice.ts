import { createSlice, isRejected } from "@reduxjs/toolkit";

export interface ErrorState {
  showError: boolean;
  message: string;
}

// TODO: use this state to display error messages to the user once UI has been created for this
const initialState: ErrorState = {
  showError: false,
  message: ""
};

export const errorSlice = createSlice({
  name: "error",

  initialState,

  reducers: {},

  extraReducers(builder) {
    builder.addMatcher(isRejected, (_state, action) => {
      console.error(
        `Error in action "${action.type}", message: "${action.error.message}, payload:"`,
        action.payload
      );
      console.debug(action.error);
    });
  }
});

export default errorSlice.reducer;
