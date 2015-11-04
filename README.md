# Awsaml
Awsaml is an application for providing automatically rotated temporary [AWS][]
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

## Configuration
Configuring Awsaml is a multi-step process that involves a bit of back and forth
between Amazon and your identity provider. The general flow looks like this

1. Create a SAML application in your identity provider.
2. Create a SAML identity provider in AWS.
3. Create an IAM role in AWS.
4. Update the SAML application with ARNs.
5. Rebuild Awsaml with your application's metadata.

## 1. Create a SAML application in your identity provider
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

Once Okta's created your application, it will show you setup instructions.
Save the following values so you can use them later to configure Awsaml.

* entryPoint - This is the "Single Sign-On URL" for your application.
* issuer - This is the issuer URL for your application.
* cert - This is the X.509 certificate for your application.

Save the XML metadata document that's generated too, so you can register your
application in AWS.

## 2. Create a SAML identity provider in AWS
Follow [Amazon's documentation for creating a SAML identity provider][saml-provider].
Save the ARN for your identity provider so you can configure it in your
application.

## 3. Create an IAM role in AWS
Follow [Amazon's documentation for creating an IAM role][iam-role]. The
permissions in this role will be the ones users are granted by their the AWS
tokens Awsaml generates.

Once the role's created, set up a trust relationship between it and your SAML
identity provider. Here's an example of the JSON policy document for that
relationship.

~~~json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "awsKeysSAML",
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam:saml-provider"
    },
    "Action": "sts:AssumeRoleWithSAML",
    "Condition": {
      "StringEquals": {
        "SAML:iss": "issuer"
      }
    }
  }]
}
~~~

Replace the "issuer" value for the "SAML:iss" key in the policy document with
the issuer URL for your application. Replace the "arn:aws:iam:saml-provider"
value for the "Federated" key in the policy document with the ARN for your
SAML identity provider.

Save the ARN for the role so you can configure it in your application.

## 4. Update the SAML application with ARNs
Now that you have ARNs for the AWS identity provider and role, you can go back
into Okta and add them to your application. Edit your application to include the
following attributes.

### Attribute Statements

| Name                                                   | Name Format | Value                                 |
----------------------------------------------------------------------------------------------------------------
| https://aws.amazon.com/SAML/Attributes/Role            | Unspecified | arn:aws:iam:role,arn:aws:iam:provider |
| https://aws.amazon.com/SAML/Attributes/RoleSessionName | Unspecified | ${user.email}                         |

Replace the "arn:aws:iam:role" value with the ARN of the role in AWS you
created. Replace the "arn:aws:iam:provider" value with the ARN of the identity
provider in AWS your created.

## 5. Rebuild Awsaml with your application's metadata
You need to edit `config.json` to include metadata about your application, then
build and package Awsaml. Change the "aws.issuer", "aws.entryPoint", and
"aws.cert" values to match the values you saved in step 1.

Awsaml is built using [Node.js][] version 4.1.1 and [NPM][] version 2.14.4, so
make sure you've got a compatible versions installed. Then run NPM to install
dependencies and build Awsaml.

~~~bash
npm install
npm run build
~~~

Those commnds will create a "dist" folder with zipped binaries. Grab the
appropriate binary for your architecture and run the Awsaml application.
It should prompt you to login to your identity provider. If the login's
successful, you'll see temporary AWS credentials in the UI.

## License and Authors
* Author:: Rapid7 LLC. (coreservices@rapid7.com)
* Author:: Frank Mitchell (frank_mitchell@rapid7.com)


[AWS]: https://aws.amazon.com
[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
[releases]: https://github.com/rapid7/awsaml/releases
[Okta]: https://www.okta.com
[Node.js]: https://nodejs.org
[NPM]: https://www.npmjs.com
[saml-provider]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml.html
[iam-role]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html
