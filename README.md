# Dev AWS Keys
This is an application that provides automatically rotated temporary AWS
credentials. Credentials are stored in `~/.aws/credentials` so they can be used
with AWS SDKs as well as `~/.mvn/settings.xml` so they can be used with Maven.
Credentials are valid for one hour and are rotated every 50 minutes while the
application's running.

The application itself is written in JavaScript, packaged with Electron, and
distributed as a desktop application. JavaScript and Electron where chosen
because the Node.js environment provides the cryptography libraries necessary
for authentication with SSH, and the Chromium runtime provides the rendering
necessary for authentication with SAML.

## Authenticate with SSH
SSH authentication requires a service running in AWS that has access to the
developer's public key. It also requires the application have access to the
developer's private key. Communication between the application and service
happens over HTTP. Every 50 minutes, the application takes the following
actions

1. Constructs a payload requesting new temporary credentials.
2. Signs the payload with the developer's private key.
3. Sends the signed payload to the service and waits for a response.

Upon receiving a signed payload, the service take the following actions

1. Verifies the signature on the payload with the developer's public key.
2. Generates new temporary AWS keys by calling the [AssumeRole][] API.
3. Returns the temporary AWS keys to the application.

Upon receiving new temporary keys the application writes them to disk. This
flow repeats every 50 minutes so the developer has a valid set of AWS keys
while the application's running.

* User Management: SSH Keys
* Authentication: Silent
* Requires Client: Yes
* Requires Server: Yes

## Authenticate with SAML
SAML authentication requires the application authenticate with an identity
provider e.g. Okta. The developer's identity provider credentials are cached in
a cookie so they're only required to authenticate when the cookie expires. Every
50 minutes, the application takes the following actions

1. Authenticates the developer with the identity provider.
2. Reads the SAML authentication response returned from the identity provider.
3. Generates new temporary AWS keys by calling the [AssumeRoleWithSAML][] API.
4. Writes the new temporary credentials to disk.

This flow repeats every 50 minutes so the developer has a valid set of AWS keys
while the application's running.

* User Management: Identity Provider
* Authentication: Prompted
* Requires Client: Yes
* Requires Server: No

## License and Authors
* Author:: Rapid7 LLC. (coreservices@rapid7.com)
* Author:: Frank Mitchell (frank_mitchell@rapid7.com)


[AssumeRole]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
