import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.span`
  background-color: whitesmoke;
  font-weight: 600;
  width: 55%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Logo = styled.img`
  height: 40px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
  margin-top: 10px;
`;

export default function GoogleBtn() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Google 로그인 성공 후 홈 페이지로 리디렉션
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <>
      <Button onClick={handleGoogleSignIn}>
        {loading ? (
          <Spinner />
        ) : (
          <Logo src='/google-btn.svg' alt='Google Logo' />
        )}
        {loading ? 'Signing in...' : ''}
      </Button>
      {error && <Error>{error.message}</Error>}
    </>
  );
}
