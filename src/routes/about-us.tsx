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
  // text-align: start;
  font-size: 20px;
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
        Candela는 밤에 빛나는 텐트가 마치 반딧불처럼 아름답다는 영감을 받아
        만들어진 백패킹 커뮤니티입니다. 우리는 백패커들이 서로 정보를 공유하고,
        바람직한 백패킹 문화를 형성하는 것을 목표로 합니다.
        <br /> 최근 백패킹의 인기가 높아짐에 따라, 백패킹 장소에서의 불법 화기
        사용, 쓰레기 무단 투기 등 환경적인 문제가 빈번하게 발생하고 있습니다.
        이러한 문제들을 해결하고, 자연을 사랑하는 모든 백패커들이 지속 가능한
        백패킹을 실천할 수 있도록 Candela 커뮤니티를 만들게 되었습니다.
        <br /> Candela는 백패커들이 모여 안전하고 즐거운 백패킹을 할 수 있는
        정보를 나누고, 경험을 공유하며, 더 나아가 자연을 보호하는 문화를
        형성하는 공간입니다. 여기서 여러분은 다양한 백패킹 장소에 대한 정보와
        팁을 얻고, 환경 보호를 위한 모범 사례를 배우며, 책임감 있는 백패킹을
        실천할 수 있습니다.
        <br /> Candela와 함께 자연을 사랑하는 모든 백패커들이 모여 더욱 빛나는
        백패킹 문화를 만들어갑시다.
      </Description>
      <AboutImg src='/AboutImg-1.jpg' />
    </Container>
  );
}
