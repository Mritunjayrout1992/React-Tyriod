// Change from feature/day4b
import logo from './logo.svg';
import './App.css';
import './css/style.css';
import { ToastContainer } from 'react-toastify';
import AppRouter from './routes/AppRouter.js'
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext.js';  // Import ApiProvider
import { ApiProvider } from './contexts/ApiContext.js';  // Import ApiProvider



function App() {
  return (
    <AuthProvider>
    <ApiProvider>
    <ConfigProvider>
    <div className="App">
      <AppRouter />
      <ToastContainer/>
    </div>
    </ConfigProvider>
    </ApiProvider>
    </AuthProvider>
  );
}

export default App;
