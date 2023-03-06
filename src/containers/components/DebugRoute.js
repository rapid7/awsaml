import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

const COLUMN_STYLE = {
  fontSize: '1.2rem',
};

const generateDebugReport = (hash, pathname, search) => `
pathname: ${pathname}
search: ${search}
hash: ${hash}
`.trim();

function Child(props) {
  const {
    hash,
    pathname,
    search,
  } = props;

  return (
    <Container>
      <Row>
        <Col style={COLUMN_STYLE}>
          Route:
          <pre className="language-bash">
            {generateDebugReport(hash, pathname, search)}
          </pre>
        </Col>
      </Row>
    </Container>
  );
}

Child.propTypes = {
  hash: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
};

const mapStateToProps = ({ routing: { location } }) => ({
  hash: location.hash,
  pathname: location.pathname,
  search: location.search,
});

export default connect(mapStateToProps)(Child);
