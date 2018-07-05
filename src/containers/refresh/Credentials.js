import React from 'react';
import {
  Card,
  CardBody
} from 'reactstrap';
import PropTypes from 'prop-types';
import {InputGroupWithCopyButton} from '../components/InputGroupWithCopyButton';

export const Credentials = ({awsAccessKey, awsSecretKey, awsSessionToken}) => {
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
    <details>
      <summary>Credentials</summary>
      <Card>
        <CardBody className="bg-light mb-3">
          <dl>
            {
              Array.from(creds).map(([name, value]) => {
                const id = name.toLowerCase().split(' ').join('-');

                return (
                  <div key={name}>
                    <dt>{name}:</dt>
                    <dd>
                      <InputGroupWithCopyButton
                        id={id}
                        name={`input-${id}`}
                        value={value}
                      />
                    </dd>
                  </div>
                );
              })
            }

          </dl>
        </CardBody>
      </Card>
    </details>
  );
};

Credentials.propTypes = {
  awsAccessKey: PropTypes.string.isRequired,
  awsSecretKey: PropTypes.string.isRequired,
  awsSessionToken: PropTypes.string.isRequired,
};
