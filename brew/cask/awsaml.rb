cask "awsaml" do
  version "3.1.0"
  sha256 "b6336c92d518108469c0b2302a7da0f9c3ae7cc9916b035edf10fbaf70ae9104"

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
