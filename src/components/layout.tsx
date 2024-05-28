import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import styled from 'styled-components';

const MainContent = styled.div<{ $isHome: boolean }>`
  padding-top: ${(props) => (props.$isHome ? '0' : '70px')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
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
        <Footer />
      </MainContent>
    </>
  );
}
