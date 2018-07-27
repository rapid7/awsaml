cask 'awsaml' do
  version '2.0.0'
  sha256 'cea42994cb52a71b8f811c38b25281604360b8216889e0f3217d4583cd7ead1a'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '786054d12bd083162881c42f3ec651187044c9d8ea5e30b485d6cba3c6e04c8c'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
