import {twMerge} from "tailwind-merge";
import type {InputHTMLAttributes} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input
            className={twMerge(
                "w-full bg-zinc-800 text-zinc-100 text-[15px] rounded-full py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-shadow placeholder-zinc-400",
                className
            )}
            {...props}
        />
    );
};

export default Input;
