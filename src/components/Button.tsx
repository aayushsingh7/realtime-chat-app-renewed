import { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className="button" type="button" {...props}>
      {children}
    </button>
  );
};

export default Button;
