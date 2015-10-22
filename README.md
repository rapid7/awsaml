# Dev AWS Keys

This is an application that provides automatically rotated temporary AWS
credentials. Credentials are stored in `~/.aws/credentials` so they can be used
with AWS SDKs as well as `~/.mvn/settings.xml` so they can be used with Maven.
Credentials are valid for one hour and are rotated every 50 minutes while the
application's running.

The application itself is written in JavaScript, packaged with Electron, and
distributed as a native application. JavaScript and Electron where chosen
because the Node.js environment provides the cryptography libraries necessary
to do authentication with SSH, and the Chromium runtime provides the rendering
necessary to do authentication with SAML.

## Authenticate with SSH
SSH authentication requires a service running in AWS that has access to the
developer's public key. The application contacts the service to request
temporary AWS keys. The request is signed with the developer's private key and
the service verifies the signature with the developer's public key. Assuming the
verification is correct, the service calls the [AssumeRole][] API in AWS to
generate temporary credentials which are returned to the application. All
communication between the application and service happens over HTTP.

* User Management: Github
* Code Complexity: Low
* Requires Client: Yes
* Requires Server: Yes

## Authenticate with SAML
SAML authentication requires the application authenticate with an identity
provider e.g. Okta to generate a SAML authentication response. The application
then calls the [AssumeRoleWithSAML][] API in AWS to generate temporary
credentials.

* User Management: Okta
* Code Complexity: High
* Requires Client: Yes
* Requires Server: No

## License and Authors
* Author:: Rapid7 LLC. (coreservices@rapid7.com)
* Author:: Frank Mitchell (frank_mitchell@rapid7.com)


[AssumeRole]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
