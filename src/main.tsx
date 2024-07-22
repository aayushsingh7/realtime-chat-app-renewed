import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./layouts/Error.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <Provider store={store}>
      <ErrorBoundary fallback={<Error />}>
        <App />
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>

);
