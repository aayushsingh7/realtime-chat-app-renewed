import React, {useEffect, useState} from "react";
import Button from "./Button";

export interface MenuOption {
    text: string;
    icon: React.ElementType;
    func: () => void;
}

interface ContextMenuProps {
    isOpen: boolean;
    x: number;
    y: number;
    options: MenuOption[];
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({isOpen, x, y, options, onClose}) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const [originClass, setOriginClass] = useState("origin-top-left");

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const estimatedHeight = options.length * 40 + 12;
            const estimatedWidth = 220;

            let finalX = x;
            let finalY = y;
            let originY = "top";
            let originX = "left";

            if (y + estimatedHeight > window.innerHeight) {
                finalY = y - estimatedHeight;
                originY = "bottom";
            }

            if (x + estimatedWidth > window.innerWidth) {
                finalX = x - estimatedWidth;
                originX = "right";
            }

            setMenuStyle({top: finalY, left: finalX, width: estimatedWidth});
            setOriginClass(`origin-${originY}-${originX}`);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, x, y, options.length]);

    if (!shouldRender) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={onClose}
            onContextMenu={(e) => {
                e.preventDefault();
                onClose();
            }}
        >
            <div
                className={`absolute bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl p-1.5 flex flex-col gap-0.5 transition-all duration-200 ease-out ${originClass} ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={menuStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {options.map((option, idx) => {
                    const Icon = option.icon;
                    return (
                        <Button
                            variant={
                                option.text.toLowerCase().includes("delete") || option.text.toLowerCase() == "logout"
                                    ? "destructive"
                                    : "default"
                            }
                            Icon={Icon}
                            text={option.text}
                            onClick={() => {
                                option.func();
                                onClose();
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ContextMenu;
