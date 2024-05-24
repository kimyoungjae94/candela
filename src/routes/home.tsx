import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const images = ['/banner-1.jpg', '/banner-2.jpg', '/banner-3.jpg'];

const PageContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Banner = styled.div<{ $backgroundImage: string }>`
  width: 100vw; /* 뷰포트 너비를 꽉 채우도록 설정 */
  height: 900px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 0;
  transition: background-image 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const TextOverlay = styled.div`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: absolute;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const Button = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.29);
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0);
  }
`;

const Content = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1200px; /* 최대 너비를 설정하여 중앙 정렬 */
  box-sizing: border-box;
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */
`;

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <Banner $backgroundImage={images[currentImageIndex]}>
        <TextOverlay>
          <h1>Welcome to the Community!</h1>
          <p>This is the home page of our community site.</p>
          <Button to='/about-us'>About Us</Button>
        </TextOverlay>
      </Banner>
      <Content>
        <p>Additional content can go here.</p>
      </Content>
    </PageContainer>
  );
}
