cask 'awsaml' do
  sha256 '8840a68b2e1c2ce1fa46a3bb830dd1d2d997e1e7cd49fdc7bcfec40351df97e4'
  version '2.0.0'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '61fe9e234a69897a47af09aed4c0478e03a1c4e4c874174555db033a14aedea2'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
