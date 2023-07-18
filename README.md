# Awsaml

(https://coveralls.io/repos/github/rapid7/awsaml/badge.svg?branch=master)](https://coveralls.io/github/rapid7/awsaml?branch=master)

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

## Configuration

Configuring Awsaml is a multi-step process that involves a bit of back and forth
between Amazon and your identity provider. The general flow looks like this

1. Create a SAML application in your identity provider.
2. Create a SAML identity provider in AWS.
3. Create an IAM role in AWS.
4. Update the SAML application with ARNs.
5. Run Awsaml and give it your application's metadata.

### 1. Create a SAML application in your identity provider

The only tested identity provider is [Okta][]. To use Awsaml with Okta, you'll
need to create a SAML 2.0 application in Okta with the following settings

#### SAML Settings

| Name                       | Value                                  |
|----------------------------|----------------------------------------|
| Single Sign On URL         | http://localhost:2600/sso/saml         |
| Recipient URL              | http://localhost:2600/sso/saml         |
| Destination URL            | http://localhost:2600/sso/saml         |
| Audience Restriction       | http://localhost:2600/sso/saml         |
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

Among those instructions will be a URL for a generated XML metadata document
that will look something like this:

```
https://www.okta.com/app/{APP_ID}/sso/saml/metadata
```

Where `APP_ID` is the application ID Okta has assigned to your newly created
app.

You should do two things with this url:

1. Copy the url and store it somewhere locally because you will need to provide
   it to the Awsaml desktop application you run later.
2. Download the contents of the url to a file on disk because you will need to
   supply that file when you create an identity provider in AWS.

#### A note on naming things (if you are using Okta)

In the next two steps, you will create and name an identity provider and a role.
Be sure to choose short names (fewer than 28 characters between the two).

In the step after you create the identity provider and the role, you will need
to take the ARNs for the identity provider and role and submit them to Okta.
However, the field into which you will paste these values on the Okta website
has a 100 character limit which is not immediately evident.

You will need to provide a string in the format:

```
{ROLE_ARN},{IDENTITY_PROVIDER_ARN}
```

The `ROLE_ARN` will be in this format:

```
arn:aws:iam::{ACCOUNT_ID}:role/{ROLE_NAME}
```

Where the `ACCOUNT_ID` is 12 digits long, and the `ROLE_NAME` is as long as you
want it to be.

The `IDENTITY_PROVIDER_ARN` will be in this format:

```
arn:aws:iam::{ACCOUNT_ID}:saml-provider/{PROVIDER_NAME}
```

Where the `ACCOUNT_ID` is 12 digits long, and the `PROVIDER_NAME` is as long as
you want it to be.

Thus, when combined, the two ARNs will take up 72 characters without considering
the number of characters that the names have.

```
arn:aws:iam::XXXXXXXXXXXX:role/,arn:aws:iam::XXXXXXXXXXXX:saml-provider/
```

As a consequence, between the name you give to the identity provider and the name
you give to the role, you can only use up to 28 characters.

### 2. Create a SAML identity provider in AWS

Follow [Amazon's documentation for creating a SAML identity provider][saml-provider],
in which you will need to upload the metadata document you downloaded in the
previous step.

Save the ARN for your identity provider so you can configure it in your
application.

### 3. Create an IAM role in AWS

Follow [Amazon's documentation for creating an IAM role][iam-role] with the
following modifications:

1. In step 2 "Select Role Type"
    1. After clicking "Role for Identity Provider Access", choose "Grant API
       access to SAML identity providers"
1. In step 3 "Establish Trust"
    1. For 'SAML provider', choose the provider you previous set up
    2. For 'Attribute', choose SAML:iss
    3. For 'Value', supply the Issuer URL provided by Okta when you created the
       application

The permissions in this role will be the ones users are granted by their the
AWS tokens Awsaml generates.

Once the role's created, a trust relationship should have been established
between your role and the SAML identity provider you created. If not, you will
need to set up a trust relationship between it and your SAML identity provider
manually. Here's an example of the JSON policy document for that relationship.

```json
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
```

Replace the "issuer" value for the "SAML:iss" key in the policy document with
the issuer URL for your application. Replace the "arn:aws:iam:saml-provider"
value for the "Federated" key in the policy document with the ARN for your
SAML identity provider.

Save the ARN for the role so you can configure it in your application.

### 4. Update the SAML application with ARNs

Now that you have ARNs for the AWS identity provider and role, you can go back
into Okta and add them to your application. Edit your application to include the
following attributes.

#### Attribute Statements

| Name                                                   | Name Format | Value                                 |
|--------------------------------------------------------|-------------|---------------------------------------|
| https://aws.amazon.com/SAML/Attributes/Role            | Unspecified | arn:aws:iam:role,arn:aws:iam:provider |
| https://aws.amazon.com/SAML/Attributes/RoleSessionName | Unspecified | ${user.email}                         |

Replace the "arn:aws:iam:role" value with the ARN of the role in AWS you
created. Replace the "arn:aws:iam:provider" value with the ARN of the identity
provider in AWS your created.


##### Multiple Role Support

To support multiple roles, add multiple values to the `https://aws.amazon.com/SAML/Attributes/Role`
attribute.  For example:

```
arn:aws:iam:role1,arn:aws:iam:provider
arn:aws:iam:role2,arn:aws:iam:provider
arn:aws:iam:role3,arn:aws:iam:provider
```

*Special note for Okta users*:  Multiple roles must be passed as multiple values to a single
attribute key.  By default, Okta serializes multiple values into a single value using commas.
To support multiple roles, you must contact Okta support and request that the
`SAML_SUPPORT_ARRAY_ATTRIBUTES` feature flag be enabled on your Okta account.  For more details
see [this post](https://devforum.okta.com/t/multivalued-attributes/179).


### 5. Run Awsaml and give it your application's metadata

You can find a prebuilt binary for Awsaml on [the releases page][releases]. Grab
the appropriate binary for your architecture and run the Awsaml application. It
will prompt you for a SAML metadata URL. Enter the URL you saved in step 1. If
the URL's valid, it will prompt you to log in to your identity provider. If the
login's successful, you'll see temporary AWS credentials in the UI.

## Building

Awsaml is built using [Node][] and [Yarn 3][], so
make sure you've got a compatible versions installed. Then run Yarn to install dependencies and build Awsaml.

```bash
rm -rf node_modules/
yarn install
yarn build
```

Those commands will create a "out" folder with zipped binaries. If you only want to create binaries for specific platforms, you can set a `PLATFORM` environment
variable before building.

```bash
export PLATFORM=linux
yarn build
```

Allowed values for `PLATFORM` are `darwin`, `linux` and `win32`. You can build
binaries for multiple platforms by using a comma separated list.

```bash
export PLATFORM=darwin,linux
yarn build
```

Similarly, if you want to
specify the build architecture, you can set a `ARCH`
environment variable before building.

```bash
export ARCH=universal
export PLATFORM=darwin
yarn build
```

Supported architectures are `ia32`, `x64` , `armv7l`,
`arm64`, `mips64el`, `universal`, or `all`.

## Setup on macOS with Homebrew

A caskfile is bundled with the repository, to install Awsaml with [Homebrew][] simply run:

`wget https://raw.githubusercontent.com/rapid7/awsaml/master/brew/cask/awsaml.rb`
`brew install --cask awsaml.rb`

There might be an error and warning prompt but it should start succesfully downloading right after
When download is succesfully installed, a `awsaml was successfully installed!` prompt is displayed

## License

Awsaml is licensed under a MIT License. See the "LICENSE.md" file for more
details.

## Special Thanks

* [Tristan Harward] for the app icon.

[AWS]: https://aws.amazon.com
[AssumeRoleWithSAML]: http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html
[releases]: https://github.com/rapid7/awsaml/releases
[Okta]: https://www.okta.com
[Node]: https://nodejs.org
[Yarn 3]: https://yarnpkg.com
[saml-provider]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_saml.html
[iam-role]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html
[Homebrew]: http://brew.sh/
[Tristan Harward]: https://github.com/trisweb
