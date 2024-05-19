import { FC, ReactNode } from 'react';
import { useCustomSelector } from '../hooks/useCustomSelector';
import { UserType } from '../types/types';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector((state) => state.user)
    const location = useLocation()

    if (location.pathname === "/login" || location.pathname === "/register") {
        if (loggedInUser._id) {
            return < Navigate to={"/"} />
        }
    } else {
        if (!loggedInUser._id) {
            return <Navigate to={"/login"} />

        }
    }

    return children
};

export default ProtectedRoute;
