import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: any;
}

const Input: FC<InputProps> = ({ ref, ...props }) => {
  return <input ref={ref} {...props} className="input" />;
};

export default Input;
