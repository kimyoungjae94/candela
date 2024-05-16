import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import styled from 'styled-components';

const MainContent = styled.main`
  padding-top: 70px;
`;

export default function Layout() {
  return (
    <>
      <Navbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
}
