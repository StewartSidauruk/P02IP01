import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router';import UserLayout from './layouts/UserLayout.jsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage';
import AuthContextProvider from './contexts/AuthContext.jsx';

function AdminProtectedPage({ children }) {
  const { role } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/', {
        state: location,
        replace: true,
      });
    }
    if (role === 'user') {
      navigate('/', {
        state: location,
        replace: true,
      });
    }
  }, []);

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <UserLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);

function App() {

  return (
    <AuthContextProvider>
      <RouterProvider router={router}/>
    </AuthContextProvider>
  )
}

export default App