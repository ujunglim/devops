import "./App.css";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "../../layout";
import { renderRoutes } from "react-router-config";
import routes from "../../config/routes";
import { Provider } from "react-redux";
import store from "../../store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout>
          <Suspense>{renderRoutes(routes)}</Suspense>
        </AppLayout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
