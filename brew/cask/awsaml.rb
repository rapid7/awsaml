cask 'awsaml' do
  version '2.2.2'
  sha256 'bd314a4960ee4c996733af19cf9f77385625480b61136dd0f53fa91ede65f10e'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
