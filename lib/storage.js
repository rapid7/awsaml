'use strict';

const app = require('app');
const fs = require('fs');
const path = require('path');

class Storage {
  constructor() {
    this.data = null;
    this.file = path.join(app.getPath('userData'), 'data.json');
  }

  load() {
    if (this.data !== null) {
      return;
    }
    if (!fs.existsSync(this.file)) {
      this.data = {};
      return;
    }
    this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  }

  save() {
    if (this.data !== null) {
      fs.writeFileSync(this.file, JSON.stringify(this.data), 'utf8');
    }
  }

  set(key, value) {
    this.load();
    this.data[key] = value;
    this.save();
  }

  get(key) {
    let value = null;

    this.load();
    if (key in this.data) {
      value = this.data[key];
    }
    return value;
  }
}

module.exports = new Storage();
