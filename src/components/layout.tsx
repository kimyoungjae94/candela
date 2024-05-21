import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import styled from 'styled-components';

const MainContent = styled.main<{ $isHome: boolean }>`
  padding-top: ${(props) => (props.$isHome ? '0' : '70px')};
`;

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <MainContent $isHome={isHome}>
        <Outlet />
      </MainContent>
    </>
  );
}
