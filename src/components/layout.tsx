import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import styled from 'styled-components';

const MainContent = styled.main<{ $isHome: boolean }>`
  padding-top: ${(props) => (props.$isHome ? '0' : '70px')};
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
`;

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <MainContent $isHome={isHome}>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </>
  );
}
