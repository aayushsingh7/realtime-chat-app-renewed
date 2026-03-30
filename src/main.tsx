import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import "./global.css";
import App from "./App.tsx";
import {store} from "./store/store.ts";
import {SocketProvider} from "./context/socketContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </SocketProvider>
    </StrictMode>
);
