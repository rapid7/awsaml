import React from 'react';
import {Card, CardBody} from 'reactstrap';
import {CredentialItem} from './CredentialItem';

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
                return(<CredentialItem title={name} value={value} key={name} />);
              })
            }

          </dl>
        </CardBody>
      </Card>
    </details>
  );
};
