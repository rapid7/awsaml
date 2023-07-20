class Reloader {
  intervalId = null;

  constructor({ name, callback, interval, role=null }) {
    this.name = name;
    this.callback = callback;
    this.interval = interval;
    this.role = role;
  }

  setCallback(callback) {
    this.callback = callback;
  }

  start() {
    this.intervalId = setInterval(this.callback, this.interval);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  restart() {
    this.stop();
    this.start();
  }

  setResponse(response) {
    this.response = response;
  }

  getResponse() {
    return this.response;
  }
}

module.exports = Reloader;

