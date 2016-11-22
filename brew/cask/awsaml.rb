cask 'awsaml' do
  version '1.4.0'
  sha256 '3f3aa01510627eafead8a205dda2423b3f5c8b36afd4dfc777cdb5781b30fe6b'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '881468e03a4add3ccaac07636e2812a915b14cecd9c66025829e1b7290b98c53'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'
  license :mit

  app 'Awsaml.app'
end
