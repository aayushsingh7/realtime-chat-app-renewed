import { Dispatch } from "@reduxjs/toolkit";

const handleDiscard = (dis: Dispatch, condition: boolean, func: any) => {
  if (condition) {
    const confirmCancel = window.confirm("Want to discard message ?");
    if (confirmCancel) {
      dis(func(false));
    }
  }
};
 
export default handleDiscard;
