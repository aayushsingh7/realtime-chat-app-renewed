import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const Auth = () => {
    const [showSlowMessage, setShowSlowMessage] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/";

    useEffect(() => {
        setTimeout(() => {
            navigate(from, {replace: true});
        }, 5000);
        const timer = setTimeout(() => setShowSlowMessage(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-3">
            <h1 className="text-white font-bold text-4xl tracking-tight mb-1">
                Welcome To <span className="text-indigo-400">ChatVerse</span>
            </h1>

            <p className="text-slate-400 text-base flex items-center  justify-center text-xl">
                Please wait while we verify you{" "}
                <span className="ml-2 w-6 h-6 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin" />
            </p>

            {showSlowMessage && (
                <p className="text-amber-400/80 text-sm mt-4 px-6 text-center max-w-sm absolute bottom-10">
                    Free hosting takes longer to boot - please be patient and wait.
                </p>
            )}
        </div>
    );
};

export default Auth;
