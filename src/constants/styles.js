import styled from 'styled-components';

export const BORDER_COLOR_SCHEME_MEDIA_QUERY = `
  @media (prefers-color-scheme: dark) {
    border: 1px solid rgb(249, 249, 249);
    color: rgb(249, 249, 249);
  }

  @media (prefers-color-scheme: light) {
    border: 1px solid rgb(108, 117, 125);
    color: rgb(51, 51, 51);
  }
`;

export const RoundedWrapper = styled.div`
  border-radius: 6px;
  padding: 30px;
  box-shadow: rgba(175, 175, 175, 0.2) 0 1px 2px 0;
  min-width: 100%;

  ${BORDER_COLOR_SCHEME_MEDIA_QUERY}
`;

export const RoundedContent = styled.div`
  border-radius: 6px;
  padding: 20px;
  word-wrap: break-word;

  ${BORDER_COLOR_SCHEME_MEDIA_QUERY}
`;

export const BUTTON_MARGIN = `
  margin-left: 10px;
`;

export const DARK_MODE_AWARE_BORDERLESS_BUTTON = `
  border: 0;
  margin-bottom: 3px;
  text-decoration: none;

  :hover {
    @media (prefers-color-scheme: dark) {
      color: rgb(249, 249, 249);
    }

    @media (prefers-color-scheme: light) {
      color: rgb(51, 51, 51);
    }
  }

  @media (prefers-color-scheme: dark) {
    color: rgb(249, 249, 249);
  }

  @media (prefers-color-scheme: light) {
    color: rgb(51, 51, 51);
  }
`;
