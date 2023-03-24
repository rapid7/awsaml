const {
  TouchBar,
} = require('electron');
const path = require('path');
const { app } = require('./api/server');

const {
  TouchBarButton,
  TouchBarGroup,
  TouchBarPopover,
  TouchBarSpacer,
} = TouchBar;

const baseUrl = process.env.ELECTRON_START_URL || app.get('baseUrl');
const configureUrl = path.join(baseUrl, app.get('configureUrlRoute'));
const refreshUrl = path.join(baseUrl, app.get('refreshUrlRoute'));

const buttonForProfileWithUrl = (browserWindow, profile, url) => new TouchBarButton({
  backgroundColor: '#3B86CE',
  click: () => {
    browserWindow.loadURL(configureUrl, {
      extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
      postData: [{
        bytes: Buffer.from(`metadataUrl=${url}&origin=electron`),
        type: 'rawData',
      }],

    });
  },
  label: profile.replace(/^awsaml-/, ''),
});

const loadTouchBar = (browserWindow, storedMetadataUrls) => {
  const refreshButton = new TouchBarButton({
    backgroundColor: '#62ac5b',
    click: () => {
      browserWindow.loadURL(refreshUrl);
    },
    label: '🔄',
  });

  const profileButtons = storedMetadataUrls
    .map((storedMetadataUrl) => (
      buttonForProfileWithUrl(browserWindow, storedMetadataUrl.name, storedMetadataUrl.url)
    ));
  const touchbar = new TouchBar({
    items: [
      refreshButton,
      new TouchBarGroup({
        items: profileButtons.slice(0, 3),
      }),
      new TouchBarSpacer({
        size: 'flexible',
      }),
      new TouchBarPopover({
        items: profileButtons,
        label: '👥 More Profiles',
      }),
    ],
  });

  browserWindow.setTouchBar(touchbar);
};

module.exports = {
  loadTouchBar,
};
