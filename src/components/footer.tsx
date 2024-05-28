import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #f1f1f1;
  padding: 20px;
  text-align: center;
  text-align: center;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  margin: 0;
  color: #555;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterText>&copy; 2024 OUTDOOR BACKPACKING COMPANY.</FooterText>
    </FooterContainer>
  );
}
