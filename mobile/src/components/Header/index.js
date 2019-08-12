import React from 'react';
import styled from 'styled-components/native';

import logo from '~/assets/logo.png';

const Container = styled.View`
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`;

const Header = () => (
  <Container>
    <Logo source={logo} />
  </Container>
);

export default Header;
