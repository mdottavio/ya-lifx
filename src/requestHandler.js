'use strict';

var request = require('request');

let requestHandler = function() {

  let token = '';

  let baseUrl = 'https://api.lifx.com/v1/';

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

      request(options, function(err, res, body) {
        body = JSON.parse(body);
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
      });
    });
  };

  /**
   * Set the lifx token
   *
   * Generate valid tokens on https://cloud.lifx.com/settings
   * @param {String} aToken
   */
  let _setToken = function(aToken) {
    token = aToken;
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
    put: _doPut
  };
};
module.exports = requestHandler();
