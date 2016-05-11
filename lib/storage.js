'use strict';

const fs = require('fs');

class Storage {
  /**
   * Constructor
   * @param {string} file
   */
  constructor(file) {
    this.data = null;
    this.file = file;
  }

  /**
   * Load the storage file
   */
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

  /**
   * Save the storage file
   */
  save() {
    if (this.data !== null) {
      fs.writeFileSync(this.file, JSON.stringify(this.data), 'utf8');
    }
  }

  /**
   * Set the value specified by key
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this.load();
    this.data[key] = value;
    this.save();
  }

  /**
   * Get the value by key
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    let value = null;

    this.load();
    if (key in this.data) {
      value = this.data[key];
    }
    return value;
  }
}

module.exports = (path) => new Storage(path);
