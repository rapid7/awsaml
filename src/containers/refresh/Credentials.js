import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Collapse,
} from 'reactstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputGroupWithCopyButton from '../components/InputGroupWithCopyButton';

const CredProps = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  margin: 0;
  padding: .5rem;
`;

const CredPropsKey = styled.dt`
  grid-column: 1;
  margin-right: 1rem;
  margin-bottom: 10px;
  line-height: 2.5rem;
`;

const CredPropsVal = styled.dd`
  grid-column: 2;
`;

const SmallMarginCardBody = styled(CardBody)`
  padding: 1.25rem 0.5rem;
`;

const BorderlessButton = styled(Button)`
  border: 0;
`;

function Credentials({ awsAccessKey, awsSecretKey, awsSessionToken }) {
  const [caretDirection, setCaretDirection] = useState('right');
  const [isOpen, setIsOpen] = useState(false);

  const handleCollapse = () => {
    setCaretDirection(caretDirection === 'right' ? 'down' : 'right');
    setIsOpen(!isOpen);
  };

  const creds = new Map();

  if (awsAccessKey) {
    creds.set('Access Key', awsAccessKey);
  }

  if (awsSecretKey) {
    creds.set('Secret Key', awsSecretKey);
  }

  if (awsSessionToken) {
    creds.set('Session Token', awsSessionToken);
  }

  return (
    <div>
      <BorderlessButton
        onClick={handleCollapse}
        outline
        color="link"
      >
        <FontAwesomeIcon icon={['fas', `fa-caret-${caretDirection}`]} />
        &nbsp;&nbsp;&nbsp;Credentials
      </BorderlessButton>
      <Collapse isOpen={isOpen}>
        <Card>
          <SmallMarginCardBody className="bg-light">
            <CredProps>
              {
                Array.from(creds).map(([name, value]) => {
                  const id = name.toLowerCase().split(' ').join('-');

                  return ([
                    <CredPropsKey key={`creds-dt-${name}`}>
                      {name}
                      :
                    </CredPropsKey>,
                    <CredPropsVal key={`creds-dd-${name}`}>
                      <InputGroupWithCopyButton
                        id={id}
                        name={`input-${id}`}
                        value={value}
                      />
                    </CredPropsVal>,
                  ]);
                })
              }
            </CredProps>
          </SmallMarginCardBody>
        </Card>
      </Collapse>
    </div>
  );
}

Credentials.propTypes = {
  awsAccessKey: PropTypes.string.isRequired,
  awsSecretKey: PropTypes.string.isRequired,
  awsSessionToken: PropTypes.string.isRequired,
};

export default Credentials;
