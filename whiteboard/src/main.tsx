import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.tsx';
import { initKeycloak } from './keycloak.ts';

const container = document.getElementById('root');
const root = createRoot(container!);

initKeycloak()
  .then((keycloakInstance) => {
    console.log("Keycloak Init Success. Authenticated:", keycloakInstance.authenticated);
    root.render(<App initialAuth={!!keycloakInstance.authenticated} />);
  })
  .catch((error) => {
    console.error("Keycloak Init Failed:", error);
    root.render(
      <div className="container mt-5">
        <div className="alert alert-danger">
          Failed to initialize authentication service.
          <br />
          <small>{JSON.stringify(error)}</small>
        </div>
      </div>
    );
  });