cask 'awsaml' do
  version '1.5.0'
  sha256 'fd1d22780e47dd13ba2507c9a4661aa259d77e606fb9527a680342414dc6a2aa'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '3d2a662d80c619406bac6682158d8b89320b9d5359863cfbeddd574b00019e9a'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
