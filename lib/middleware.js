
class Middleware {
  constructor() {
    this._req = [];
    this._res = [];
  }

  request(fn) {
    this._req.push(fn);
    return this._req.length - 1;
  }

  response(fulfill, reject) {
    fulfill || (fulfill = res => Promise.resolve(res));
    reject  || (reject  = err => Promise.reject(err));

    this._res.push({ fulfill, reject });
    return this._res.length - 1;
  }

  resolveRequests(config) {
    return this._req.reduce((promise, task) => {
      promise = promise.then(task);
      return promise;
    }, Promise.resolve(config));
  }

  resolveResponses(response) {
    return this._res.reduce((promise, task) => {
      promise = promise.then(task.fulfill, task.reject);
      return promise;
    }, Promise.resolve(response));
  }
}

module.exports = Middleware;