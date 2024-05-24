import styled from 'styled-components';

const Container = styled.div`
  // padding: 40px;
  text-align: center;
`;

const Title = styled.h1`
  color: #4a6177;
  font-weight: bold;
  font-size: 36px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #4a6177;
  font-size: 18px;
  line-height: 1.6;
`;

const AboutImg = styled.img`
  width: 100%;
`;

export default function AboutUs() {
  return (
    <Container>
      <Title>Candela (깐델라) 란?</Title>
      <Description>
        Welcome to our community! We started this platform to bring together
        like-minded individuals who share a passion for [your community's
        interest]. Our goal is to provide a space where members can connect,
        share knowledge, and support each other. Whether you're here to learn,
        share, or simply make new friends, we hope you find value and joy in
        being a part of our community.
      </Description>
      <AboutImg src='/AboutImg-1.jpg' />
    </Container>
  );
}
