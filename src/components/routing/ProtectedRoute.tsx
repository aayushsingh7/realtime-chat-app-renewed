import {Navigate, useLocation} from "react-router-dom";
import {useAppSelector} from "../../store/hooks";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const user = useAppSelector((state) => state.user.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/auth" state={{from: location.pathname}} replace />;
    }

    return children;
}
