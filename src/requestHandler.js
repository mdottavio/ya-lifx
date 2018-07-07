'use strict';

const fetch = require('node-fetch');
const encoder = require('form-urlencoded').default;

class RequestHandler {

  constructor(token = '') {
    this.baseUrl = 'https://api.lifx.com/v1/';
    this.setToken(token);
    this.apiRateLimit = null;
  }

  _validateApiRateLimit() {
    return (this.apiRateLimit == null) || (this.apiRateLimit.remaining > 0);
  };

  /**
   * Set the lifx token and reset the API limits
   *
   * Generate valid tokens on https://cloud.lifx.com/settings
   * @param {String} aToken
   */
  setToken(aToken) {
    this.token = aToken;
    this.apiRateLimit = null;
  };

  /**
   * Perform a `GET` request on the give endpoint.
   * @param  {String}  endpoint
   * @return {Promise}
   */
  get(endpoint) {
    return this.doRequest(endpoint, 'GET').then(res => res.json())
  };

  /**
   * Perform a `POST` request on the give endpoint with the given Object.
   * @param  {String}  endpoint
   * @param  {Object}  data
   * @return {Promise}
   */
  post(endpoint, data) {
    return this.doRequest(endpoint, 'POST', encoder(data), {'Content-Type': 'application/x-www-form-urlencoded'})
    .then(res => res.json())
  };

  /**
   * Perform a JSON encoded `POST` request on the give endpoint with the given Object.
   * @param  {String}  endpoint
   * @param  {Object}  data
   * @return {Promise}
   */
  postJson(endpoint, data) {
    return this.doRequest(endpoint, 'POST', JSON.stringify(data), {'Content-Type': 'application/json'})
    .then(res => res.json())
  };

  /**
   * Perform a `PUT` request on the give endpoint with the given Object.
   * @param  {String}  endpoint
   * @param  {Object}  data
   * @return {Promise}
   */
  put(endpoint, data) {
    return this.doRequest(endpoint, 'PUT', encoder(data), {'Content-Type': 'application/x-www-form-urlencoded'})
    .then(() => null);
  };

  /**
   * Return the latest limit data available.
   * @return {Object}
   */
  getLimits() {
    return this.apiRateLimit;
  }

  /**
   * Perform a request to the given endpoint and update the API limit Object.
   * @param  {String} endpoint
   * @param  {String} method
   * @param  {Object} data
   * @return {Object} Promise
   */
  doRequest(endpoint, method, body = null, headers = {}) {
    if (this._validateApiRateLimit()) {
      const options = {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          ...headers,
        },
        method: method,
        body,
      };
      return fetch( `${this.baseUrl}${endpoint}`, options)
        .then((res) => {
          // update the apiRateLimit object
          this.apiRateLimit = {
            limit: parseInt(res.headers.get('x-ratelimit-limit')) || 0,
            remaining: parseInt(res.headers.get('x-ratelimit-remaining')) || 0,
            reset: parseInt(res.headers.get('x-ratelimit-reset')) || 0
          };
          return res;
        })
    } else {
      return Promise.reject({
        error: 'User request limit reached',
        warnings: {}
      });
    }
  }
}

module.exports = RequestHandler;
