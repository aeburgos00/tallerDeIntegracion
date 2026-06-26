import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider  } from "./context/AuthContext";
import { DateFilterProvider } from "./context/DateFilterContext";

function App() {
  return (
    <AuthProvider>
      <DateFilterProvider>
        <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      </DateFilterProvider>
    </AuthProvider>
  );
}

export default App;