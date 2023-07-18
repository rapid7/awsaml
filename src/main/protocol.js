const {
  protocol,
} = require('electron');
const {
  readFileSync,
} = require('node:fs');
const url = require('node:url');

function registerHandlers() {
  protocol.handle('awsaml', (request) => {
    const prefix = 'awsaml://'.length;

    return new Response(readFileSync(url.fileURLToPath(`file://${request.url.slice(prefix)}`)));
  });
}

module.exports = {
  registerHandlers,
};
