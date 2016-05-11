'use strict';
const path = require('path');
const Server = require('./lib/server');
const storagePath = path.join(__dirname, 'test', 'data', 'test.json');

global.Storage = require('./lib/storage')(storagePath);

const host = Server.get('host');
const port = Server.get('port');

Server.listen(port, host, () => {
  console.log('Server listening on http://%s:%s', host, port); // eslint-disable-line no-console
});
