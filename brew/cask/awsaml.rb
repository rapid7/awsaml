cask 'awsaml' do
  version '1.3.0'
  sha256 '47d6305bad6de41b95832970cf33d0d1c2e287ce7f0658a9bc6e4b9da307f0b6'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '57a816fdd5e8a7013f4b011671867b6a9de10f80bd1e6e0872baedb955cc0498'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'
  license :mit

  app 'Awsaml.app'
end
