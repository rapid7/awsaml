import React from 'react';
import {connect} from 'react-redux'
import {Container, Row, Col} from 'reactstrap';

const Child = ({pathname, search, hash}) => (
  <Container>
    <Row>
      <Col style={{fontSize: '1.2rem'}}>
        Route:
        <pre className="language-bash">
        {`
pathname: ${pathname}
search: ${search}
hash: ${hash}
`.trim()
        }
        </pre>
      </Col>
    </Row>
  </Container>
);

const mapStateToProps = ({routing: {location}}) => {
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
};

export default connect(mapStateToProps)(Child)