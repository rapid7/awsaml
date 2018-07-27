cask 'awsaml' do
  version '2.0.0'
  sha256 'cea42994cb52a71b8f811c38b25281604360b8216889e0f3217d4583cd7ead1a'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '61fe9e234a69897a47af09aed4c0478e03a1c4e4c874174555db033a14aedea2'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
