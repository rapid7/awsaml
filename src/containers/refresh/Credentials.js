import React from 'react';
import {Card, CardBody} from 'reactstrap';
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
                      <InputGroupWithCopyButton value={value} name={`input-${id}`} id={id} />
                    </dd>
                  </div>
                )
              })
            }

          </dl>
        </CardBody>
      </Card>
    </details>
  );
};
