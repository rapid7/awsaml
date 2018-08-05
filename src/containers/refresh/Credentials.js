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
        <CardBody className="bg-light">
          <dl className="mb-0" style={{display: 'grid', gridTemplateColumns: 'auto 1fr'}}>
            {
              Array.from(creds).map(([name, value]) => {
                const id = name.toLowerCase().split(' ').join('-');

                return ([
                    <dt key={'creds-dt-'+name} className="mr-2" style={{gridColumn: 1}}>{name}:</dt>,
                    <dd key={'creds-dd-'+name} style={{gridColumn: 2}}>
                      <InputGroupWithCopyButton
                        id={id}
                        name={`input-${id}`}
                        value={value}
                      />
                    </dd>
                ]);
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
