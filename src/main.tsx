import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import "./global.css";
import App from "./App.tsx";
import {store} from "./store/store.ts";
import {SocketProvider} from "./context/socketContext.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </Provider>
        </BrowserRouter>
    </StrictMode>
);
