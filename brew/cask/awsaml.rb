cask 'awsaml' do
  version '2.1.0'
  sha256 '187f13a51cb28546fc04f127827e21b5d9c8515db577a3f5f463ac91648e512f'

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  appcast 'https://github.com/rapid7/awsaml/releases.atom',
          checkpoint: '600ea5739ae752442c890ece55e6d4841d05f93a64ac923dda771a30672ca3b3'
  name 'awsaml'
  homepage 'https://github.com/rapid7/awsaml'

  app 'Awsaml.app'
end
