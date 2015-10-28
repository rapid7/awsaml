var app = require('app')
var fs = require('fs')
var path = require('path')

function Storage () {
  this.data = null
  this.file = path.join(app.getPath('userData'), 'data.json')
}

Storage.prototype.load = function () {
  if (this.data !== null) {
    return
  }
  if (!fs.existsSync(this.file)) {
    this.data = {}
    return
  }
  this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'))
}

Storage.prototype.save = function () {
  if (this.data !== null) {
    fs.writeFileSync(this.file, JSON.stringify(this.data), 'utf8')
  }
}

Storage.prototype.set = function (key, value) {
  this.load()
  this.data[key] = value
  this.save()
}

Storage.prototype.get = function (key) {
  var value = null
  this.load()
  if (key in this.data) {
    value = this.data[key]
  }
  return value
}

module.exports = new Storage()
