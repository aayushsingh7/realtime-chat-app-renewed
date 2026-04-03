import {useEffect, useState} from "react";
import { FaCheck } from "react-icons/fa";

type CheckboxProps = {
    checked?: boolean;
    onChange?: (val: boolean) => void;
};

const  Checkbox:React.FC<CheckboxProps> =({checked, onChange}) => {
    const [isChecked, setIsChecked] = useState(checked || false);

    const toggle = () => {
        const newVal = !isChecked;
        setIsChecked(newVal);
        onChange?.(newVal);
    };

    useEffect(()=> {
    // @ts-expect-error
    setIsChecked(checked)
    }, [checked])

    return (
        <button
            onClick={toggle}
            className={`w-5 h-5 flex items-center justify-center rounded-md transition
        ${isChecked ? "bg-violet-500 text-white border-3 border-violet-500" : "border-3 border-violet-500 text-transparent"}`}
        >
            {isChecked && <FaCheck className="text-sm text-black"  />}
        </button>
    );
}


export default Checkbox;