cask "awsaml" do
  version "3.1.2"
  sha256 "1cf9093156370380b328e3250a3ff7649968aee78c8bfcb09badbcdec05e36a0"

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/Awsaml-darwin-universal-#{version}.zip"
  name "awsaml"
  desc "Awsaml is an application for providing automatically rotated temporary AWS credentials."
  homepage "https://github.com/rapid7/awsaml"

  livecheck do
    url :url
    strategy :github_latest
  end

  app "Awsaml.app"
end
