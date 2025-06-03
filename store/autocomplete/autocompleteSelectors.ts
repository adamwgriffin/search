import type { AppState } from "..";

export const selectAutcompletePlacePredictions = (state: AppState) =>
  state.autocomplete.autcompletePlacePredictions;

export const selectSelectedAutcompletePlacePrediction = (state: AppState) =>
  state.autocomplete.selectedAutcompletePlacePrediction;
