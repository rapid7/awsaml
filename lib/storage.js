var app = require('app')
var fs = require('fs')
var path = require('path')

var data = null
var dataFile = path.join(app.getPath('userData'), 'data.json')

function load () {
  if (data !== null) {
    return
  }
  if (!fs.existsSync(dataFile)) {
    data = {}
    return
  }
  data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
}

function save () {
  if (data !== null) {
    fs.writeFileSync(dataFile, JSON.stringify(data), 'utf8')
  }
}

exports.set = function (key, value) {
  load()
  data[key] = value
  save()
}

exports.get = function (key) {
  var value = null
  load()
  if (key in data) {
    value = data[key]
  }
  return value
}

exports.clear = function (key) {
  laod()
  if (key in data) {
    delete data[key]
    save()
  }
}
