cask 'awsaml' do
  version '1.5.0'
  sha256 '3f3aa01510627eafead8a205dda2423b3f5c8b36afd4dfc777cdb5781b30fe6b'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '3d2a662d80c619406bac6682158d8b89320b9d5359863cfbeddd574b00019e9a'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'
  license :mit

  app 'Awsaml.app'
end
