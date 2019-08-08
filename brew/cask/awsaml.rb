cask 'awsaml' do
  version '2.2.1'
  sha256 '616fde14a614c77220529a70fbcf172a6e8a2a8bbd802af9451b07a732cf9056'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
