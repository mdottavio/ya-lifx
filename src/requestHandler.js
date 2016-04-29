'use strict';

var needle = require('needle');
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
  let doRequest = (endopoint, method, data) => {
    data = data || {};

    var deferred = Q.defer();
    var options = {
      json: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    };

    needle.request(method, baseUrl + endopoint, data, options, (err, res) => {
      if (err) {
        deferred.reject(err);
      } else if (res.statusCode < 400) {
        deferred.resolve(res.body);
      } else {
        deferred.reject({
          error: res.body.error,
          warnings: res.body.warnings || {}
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
  let _setToken = (aToken) => {
    token = aToken;
  };

  let _doGet = (endopoint) => {
    return doRequest(endopoint, 'GET');
  };

  let _doPost = (endopoint, data) => {
    return doRequest(endopoint, 'POST', data);
  };

  let _doPut = (endopoint, data) => {
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
