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

## License and Authors
* Author:: Rapid7 LLC. (coreservices@rapid7.com)
* Author:: Frank Mitchell (frank_mitchell@rapid7.com)


[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
