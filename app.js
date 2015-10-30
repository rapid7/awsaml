var Application = require('app')
var BrowserWindow = require('browser-window')
var Storage = require('./lib/storage')
var Server = require('./lib/server')
var config = require('./config')

var mainWindow = null

Application.commandLine.appendSwitch('disable-http-cache')

Application.on('window-all-closed', function() {
  Application.quit()
})

Application.on('ready', function() {
  require('./app-menu')

  var host = Server.get('host')
  var port = Server.get('port')
  Server.listen(port, host, function () {
    console.log('Server server listening on http://%s:%s', host, port)
  })

  var lastWindowState = Storage.get('lastWindowState')
  if (lastWindowState === null) {
    lastWindowState = {
      width: 800,
      height: 700
    }
  }

  mainWindow = new BrowserWindow({
    title: 'Dev AWS Keys',
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    show: false,
    'web-preferences': {
      'node-integration': false
    }
  })

  mainWindow.on('close', function () {
    var bounds = mainWindow.getBounds()
    Storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      version: 1
    })
  })

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.loadUrl(config.auth.entryPoint)
  mainWindow.show()

  setInterval(function () {
    console.log('Reloading...')
    mainWindow.loadUrl(config.auth.entryPoint)
  }, (config.aws.duration - 10) * 1000)
})
