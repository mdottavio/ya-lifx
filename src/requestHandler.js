'use strict';

var request = require('request');

let requestHandler = function() {

  let token = '';

  let baseUrl = 'https://api.lifx.com/v1/';

  let apiRateLimit = null;

  let validateApiRateLimit = () => {
    return (apiRateLimit == null) || (apiRateLimit.remaining > 0);
  };

  /**
   * Perform a request, return a promise
   *
   * @param  {String} endpoint
   * @param  {String} method
   * @param  {Object} data
   * @return {Object} Promise
   */
  let doRequest = (endpoint, method, data) => {

    return new Promise((resolve, reject) => {
      data = data || {};
      var options = {
        uri: baseUrl + endpoint,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
        method: method,
        form: data
      };

      if (validateApiRateLimit()) {
        request(options, function(err, res, body) {
          try {
            // sometimes API response with HTML
            // https://github.com/mdottavio/ya-lifx/issues/7
            body = JSON.parse(body);
            // update the apiRateLimit object
            apiRateLimit = {
              limit: parseInt(res.headers['x-ratelimit-limit']) || 0,
              remaining: parseInt(res.headers['x-ratelimit-remaining']) || 0,
              reset: parseInt(res.headers['x-ratelimit-reset']) || 0
            };

            if (err) {
              reject(err);
            } else if (res.statusCode < 400) {
              resolve(body);
            } else {
              reject({
                error: body.error,
                warnings: body.warnings || {}
              });
            }
          } catch (e) {
            reject({
              error: 'API failed',
              warnings: {}
            });
          }
        });
      } else {
        reject({
          error: 'User request limit reached',
          warnings: {}
        });
      }
    });
  };

  /**
   * Set the lifx token and reset the API limits
   *
   * Generate valid tokens on https://cloud.lifx.com/settings
   * @param {String} aToken
   */
  let _setToken = function(aToken) {
    token = aToken;
    apiRateLimit = null;
  };

  let _doGet = function(endpoint) {
    return doRequest(endpoint, 'GET');
  };

  let _doPost = function(endpoint, data) {
    return doRequest(endpoint, 'POST', data);
  };

  let _doPut = function(endpoint, data) {
    return doRequest(endpoint, 'PUT', data);
  };

  return {
    setToken: _setToken,
    get: _doGet,
    post: _doPost,
    put: _doPut,
    getLimits: () => apiRateLimit
  };
};
module.exports = requestHandler();
