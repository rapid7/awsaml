# Awsaml
Awsaml is an application for providing automatically rotated temporary AWS
credentials. Credentials are stored in `~/.aws/credentials` so they can be used
with AWS SDKs. Credentials are valid for one hour and are rotated every hour
while the application's running.

In order to rotate credentials, Awsaml takes the following actions

1. Authenticates the user with their identity provider.
2. Reads the SAML authentication response returned from the identity provider.
3. Generates new temporary AWS keys by calling the [AssumeRoleWithSAML][] API.
4. Writes the new temporary credentials to disk.

This flow repeats every hour so the user always has a valid set of AWS keys
while the application's running. Awsaml reuses the SAML response from the
identity provider, so the user doesn't need to reauthenticate every time.

You can grab prebuilt binaries for Mac, Linux, and Window from [the releases page][releases].
Awsaml is current pre-release software. Back up your `~/.aws/credentials` file
before using it, please.

## Configuring your identity provider
The only tested identity provider is [Okta][]. To use Awsaml with Okta, you'll
need to create a SAML 2.0 application in Okta with the following settings

### SAML Settings

| Name                       | Value                                  |
-----------------------------------------------------------------------
| Single Sign On URL         | http://localhost:2600/sso/saml         |
| Recipient URL              | http://localhost:2600/sso/saml         |
| Destination URL            | http://localhost:2600/sso/saml         |
| Audience Restriction       | http://localhost:2600/sso/smal         |
| Default Relay State        |                                        |
| Name ID Format             | EmailAddress                           |
| Response                   | Signed                                 |
| Assertion Signature        | Signed                                 |
| Signature Algorithm        | RSA_SHA256                             |
| Digest Algorithm           | SHA256                                 |
| Assertion Encryption       | Unencrypted                            |
| SAML Single Logout         | Disabled                               |
| authnContextClassRef       | PasswordProtectedTransport             |
| Honor Force Authentication | Yes                                    |
| SAML Issuer ID             | http://www.okta.com/${org.externalKey} |

### Attribute Statements

| Name                                                   | Name Format | Value                                 |
----------------------------------------------------------------------------------------------------------------
| https://aws.amazon.com/SAML/Attributes/Role            | Unspecified | arn:aws:iam:role,arn:aws:iam:provider |
| https://aws.amazon.com/SAML/Attributes/RoleSessionName | Unspecified | ${user.email}                         |

## Configuring Awsaml
If you need to change default Awsaml settings, like binding to a different port,
you can edit `config.json` and rebuild. Awsaml is built using [Node.js][]
version 4.1.1 and [NPM][] version 2.14.4, so make sure you've got a compatible
versions installed. Then run NPM to install dependencies and build Awsaml.

~~~bash
npm install
npm run build
~~~

Those commnds will create a "dist" folder with zipped binaries.

## License and Authors
* Author:: Rapid7 LLC. (coreservices@rapid7.com)
* Author:: Frank Mitchell (frank_mitchell@rapid7.com)


[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
[releases]: https://github.com/rapid7/awsaml/releases
[Okta]: https://www.okta.com
[Node.js]: https://nodejs.org
[NPM]: https://www.npmjs.com
