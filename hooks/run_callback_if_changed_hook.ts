import { useState } from "react";
import isEqual from "lodash/isEqual";

export const useRunCallbackIfChanged = <T>(
  value: T,
  callback: () => void
): [() => void, () => void] => {
  const [previous, setPrevious] = useState(value);

  const setPreviousFunction = () => {
    setPrevious({ ...value });
  };

  const executeCallbackIfChangedFunction = () => {
    if (!isEqual(previous, value)) {
      callback();
    }
  };

  return [setPreviousFunction, executeCallbackIfChangedFunction];
};
