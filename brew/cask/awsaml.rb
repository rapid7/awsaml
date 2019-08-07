cask 'awsaml' do
  version '2.2.0'
  sha256 'f9a0a74c3630cc6a53b5d68bb34cd545827f9541b6393046bfff88b1658de4ae'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
