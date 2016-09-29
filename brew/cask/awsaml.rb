cask 'awsaml' do
  version '1.3.0'
  sha256 '4f4459551c3991aed287b02486b8bf0562f6d2fb99e45e93cbe1ee21bc099e0d'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: 'e6d9e30a41aa77bd8cd9248e4f58076d6820f3f733b92a1fa84284d4119aa4b5'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'
  license :mit

  app 'Awsaml.app'
end
