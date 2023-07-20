class ReloadManager {
  reloaders = {};

  get(name) {
    return this.reloaders[name];
  }

  add(reloader) {
    this.reloaders[reloader.name] = reloader;
  }

  removeByName(name) {
    delete this.reloaders[name];
  }

  removeByReloader(reloader) {
    delete this.reloaders[reloader.name];
  }
}

module.exports = () => new ReloadManager();

