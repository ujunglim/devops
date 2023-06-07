import "./App.css";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "../../layout";
import { renderRoutes } from "react-router-config";
import routes from "../../config/routes";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense>{renderRoutes(routes)}</Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
