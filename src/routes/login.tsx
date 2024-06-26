import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import GoogleBtn from '../components/google-btn';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type='submit'] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 10px;
  a {
    color: #1d9bf0;
  }
`;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name='email'
          value={email}
          placeholder='Email'
          type='email'
          required
        />
        <Input
          onChange={onChange}
          name='password'
          value={password}
          placeholder='Password'
          type='password'
          required
        />
        <Input type='submit' value={isLoading ? 'Loading...' : '로그인'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <GoogleBtn />
      <Switcher>
        계정이 없으신가요? <Link to={'/create-account'}>회원가입 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
