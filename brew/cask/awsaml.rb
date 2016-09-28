cask 'awsaml' do
  version '1.3.0'
  sha256 '4f4459551c3991aed287b02486b8bf0562f6d2fb99e45e93cbe1ee21bc099e0d'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '57a816fdd5e8a7013f4b011671867b6a9de10f80bd1e6e0872baedb955cc0498'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'
  license :mit

  app 'Awsaml.app'
end
