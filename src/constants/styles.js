import styled from 'styled-components';

const ROUNDED_6 = `
  border-radius: 6px;
`;

const WRAPPER = `
  background: rgb(255, 255, 255);
  border: 1px solid rgb(203, 203, 203);
  padding: 30px;
  box-shadow: rgba(175, 175, 175, 0.2) 0px 1px 2px 0px;
  min-width: 100%;
`;

const CONTENT = `
  background: rgb(249, 249, 249);
  border: 1px solid rgb(230, 230, 230);
  padding: 20px;
  word-wrap: break-word;
`;

export const RoundedWrapper = styled.div`
  ${ROUNDED_6}
  ${WRAPPER}
`;

export const RoundedContent = styled.div`
  ${ROUNDED_6}
  ${CONTENT}
`;

export const BUTTON_MARGIN = `
  margin-left: 10px;
`;
