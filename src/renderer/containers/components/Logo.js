import React from 'react';
import styled from 'styled-components';

const LogoImg = styled.img`
  margin-bottom: 15px;
`;

function Logo() {
  return (
    <LogoImg
      alt="Rapid7"
      src="https://rapid7.okta.com/bc/image/fileStoreRecord?id=fs011ume6fjY7HcEE0i8"
    />
  );
}

export default Logo;
