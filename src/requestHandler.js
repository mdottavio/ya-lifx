'use strict';

var request = require('request');
var Q = require('q');

let requestHandler = function() {

  let token = '';

  let baseUrl = 'https://api.lifx.com/v1/';

  /**
   * Perform a request, return a promise
   *
   * @param  {String} endopoint
   * @param  {String} method
   * @param  {Object} data
   * @return {Object} Q promise
   */
  let doRequest = function(endopoint, method, data) {
    data = data || {};

    var deferred = Q.defer();
    var options = {
      uri: baseUrl + endopoint,
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
        deferred.reject(err);
      } else if (res.statusCode < 400) {
        deferred.resolve(body);
      } else {
        deferred.reject({
          error: body.error,
          warnings: body.warnings || {}
        });
      }
    });

    return deferred.promise;
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

  let _doGet = function(endopoint) {
    return doRequest(endopoint, 'GET');
  };

  let _doPost = function(endopoint, data) {
    return doRequest(endopoint, 'POST', data);
  };

  let _doPut = function(endopoint, data) {
    return doRequest(endopoint, 'PUT', data);
  };

  return {
    setToken: _setToken,
    get: _doGet,
    post: _doPost,
    put: _doPut
  };
};
module.exports = requestHandler();
