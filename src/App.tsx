import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import AboutUs from './routes/about-us';
import Travel from './routes/travel';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-screen';
import { auth } from './firebase';
import ProtectedRoute from './components/protected-route';
import TravelCreate from './routes/travel-create-post';
import TravelDetail from './routes/travel-detail';
import ErrorBoundary from './components/error-boundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'travel',
        element: <Travel />,
      },
      {
        path: 'travel-create-post',
        element: (
          <ProtectedRoute>
            <TravelCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: 'travel-detail/:postId',
        element: <TravelDetail />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/create-account',
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
${reset};
*{
  box-sizing: border-box;
}
body {
  background-color: whitesmoke;
  color: black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe Ui',
  Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
}
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      )}
    </Wrapper>
  );
}

export default App;
