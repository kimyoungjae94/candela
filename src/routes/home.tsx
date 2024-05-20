import { useEffect, useState } from 'react';
import styled from 'styled-components';

const images = ['/banner-1.jpg', '/banner-2.jpg', '/banner-3.jpg'];

const Banner = styled.div<{ $backgroundImage: string }>`
  width: 100vw;
  height: 880px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
  transition: background-image 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TextOverlay = styled.div`
  position: absolute;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Content = styled.div`
  padding: 50px;
`;

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Banner $backgroundImage={images[currentImageIndex]}>
        <TextOverlay>
          <h1>Welcome to the Community!</h1>
          <p>This is the home page of our community site.</p>
        </TextOverlay>
      </Banner>
      <Content>
        <p>Additional content can go here.</p>
      </Content>
    </div>
  );
}
