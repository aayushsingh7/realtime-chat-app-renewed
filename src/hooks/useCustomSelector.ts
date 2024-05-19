import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useCustomSelector = <T>(selector: (state: RootState) => T) => {
  return useSelector(selector);
};
