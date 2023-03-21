cask "awsaml" do
  version "2.3.0"
  sha256 "08aac0225232a9330570176b19651cd6c330841daad06f5e37bae207a5368776"

  url "https://github.com/rapid7/awsaml/releases/download/v#{version}/awsaml-v#{version}-darwin-x64.zip"
  name "awsaml"
  desc "Awsaml is an application for providing automatically rotated temporary AWS credentials."
  homepage "https://github.com/rapid7/awsaml"
  appcast "https://github.com/rapid7/awsaml/releases.atom"

  app "Awsaml-darwin-x64/Awsaml.app"
end