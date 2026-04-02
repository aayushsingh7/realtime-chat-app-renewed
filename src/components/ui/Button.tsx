import {twMerge} from "tailwind-merge";
import type {ButtonHTMLAttributes} from "react";

type ButtonVariant = "icon" | "default" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    Icon: React.ElementType;
    iconSize?: number;
    iconClassName?: string;
    text?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
    icon: "p-2 hover:bg-zinc-800 hover:text-zinc-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700",
    default:
        "group w-full flex items-center gap-3 px-3 py-2 text-[15px] text-zinc-200 hover:text-white rounded-lg transition-colors focus:outline-none hover:bg-zinc-800 focus:bg-zinc-700",
    destructive:
        "group w-full flex items-center gap-3 px-3 py-2 text-[15px] text-zinc-200 hover:text-white rounded-lg transition-colors focus:outline-none hover:bg-red-700/30 focus:bg-red-500/50",
};

const Button: React.FC<ButtonProps> = ({
    variant = "default",
    Icon,
    iconSize = 18,
    iconClassName,
    text,
    className,
    ...props
}) => {
    return (
        <button className={twMerge(VARIANT_STYLES[variant], className)} {...props}>
            <Icon
                style={{width: iconSize, height: iconSize}}
                className={twMerge("text-zinc-400 group-hover:text-white transition-colors", iconClassName)}
            />
            {text && <span className="font-medium tracking-wide">{text}</span>}
        </button>
    );
};

export default Button;
