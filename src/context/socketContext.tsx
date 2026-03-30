import {createContext, useContext, useMemo, type ReactNode} from "react";
import {io, Socket} from "socket.io-client";
import {useAppSelector} from "../store/hooks";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({children}: {children: ReactNode}) {
    const user = useAppSelector((state) => state.user.user);
    const socket = useMemo(() => {
        if (!user) return null;
        return io(`${import.meta.env.VITE_SOCKET_URL}`, {
            transports: ["websocket"],
            auth: {token: user},
        });
    }, [user]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket(): Socket {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used inside SocketProvider");
    }
    return context;
}
