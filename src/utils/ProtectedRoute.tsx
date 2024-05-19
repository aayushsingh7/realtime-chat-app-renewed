import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomSelector } from '../hooks/useCustomSelector';
import { UserType } from '../types/types';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector((state) => state.user)
    if (!loggedInUser._id) {
        <Navigate to={"/login"} />
    }

    return children;
};

export default ProtectedRoute;
