import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import { useLocation } from 'react-router-dom';

const COLUMN_STYLE = {
  fontSize: '1.2rem',
};

const generateDebugReport = (hash, pathname, search) => `
pathname: ${pathname}
search: ${search}
hash: ${hash}
`.trim();

function DebugRoute() {
  const location = useLocation();

  return (
    <Container>
      <Row>
        <Col style={COLUMN_STYLE}>
          Route:
          <pre className="language-bash">
            {generateDebugReport({
              hash: location.hash,
              pathname: location.pathname,
              search: location.search,
            })}
          </pre>
        </Col>
      </Row>
    </Container>
  );
}

export default DebugRoute;
