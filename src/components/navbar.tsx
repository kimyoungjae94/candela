import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 150px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 네비게이션 바를 가장 위로 */
  height: 60px; /* 네비게이션 바의 높이 */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  max-height: 90px; /* 네비게이션 바의 높이에 맞춤 */
  margin-right: 10px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 10px;
`;

const AuthButton = styled.button`
  border: none;
  background: none;
  color: #4a6177;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, loading]);

  const logOut = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await auth.signOut();
        setIsLoggedIn(false);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Header>
      <LogoContainer>
        <StyledLink to='/'>
          <LogoImg src='/candela-logo2.png' alt='logo' />
        </StyledLink>
        <NavLinks>
          <StyledLink to='/travel'>
            <AuthButton>Travel</AuthButton>
          </StyledLink>
          <StyledLink to='/community-list'>
            <AuthButton>Community</AuthButton>
          </StyledLink>
        </NavLinks>
      </LogoContainer>
      <Nav>
        {isLoggedIn ? (
          <AuthButton onClick={logOut}>로그아웃</AuthButton>
        ) : (
          <>
            <StyledLink to='/create-account'>
              <AuthButton>회원가입</AuthButton>
            </StyledLink>
            <StyledLink to='/login'>
              <AuthButton>로그인</AuthButton>
            </StyledLink>
          </>
        )}
      </Nav>
    </Header>
  );
}
