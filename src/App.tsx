import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Chats from "./pages/Chats";
import Auth from "./pages/Auth";

const App = () => {
    return (
        <div className="w-[100vw] h-[100dvh]">
            <div className="h-full max-w-[1700px]">
                <Routes>
                    <Route
                        path="/chats"
                        element={
                            // <ProtectedRoute>
                                <Chats />
                            // </ProtectedRoute>
                        }
                    />

                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
