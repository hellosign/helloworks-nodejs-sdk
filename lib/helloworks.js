const fetch = require('node-fetch');
const { URL } = require('url');

const config = require('./config');
const endpoints = require('./endpoints');

class HelloWorks {

  /**
   * Creates a new HelloWorks instance.
   *
   * @param {Object} config
   * @param {string} config.apiKeyId
   * @param {string} config.apiKeySecret
   * @constructor
   */
  constructor({ apiKeyId, apiKeySecret }) {
    this._apiKeyId = apiKeyId;
    this._apiKeySecret = apiKeySecret;
    this._token = null;
    this._tokenExpiry = null;

    this._initEndpoints();
  }

  /**
   * Initializes API endpoints end registers them with the
   * HelloWorks client.
   *
   * @private
   */
  _initEndpoints() {
    Object.keys(endpoints).forEach((key) => {
      const endpoint = endpoints[key];

      Object.defineProperty(this, key, {
        value: endpoint(this),
      });
    });
  }

  /**
   * Requests a new JWT token from the API server.
   *
   * @returns {Promise}
   * @private
   */
  _refreshToken() {
    return this.token.getToken({
      apiKeyId: this._apiKeyId,
      apiKeySecret: this._apiKeySecret,
    }).then(({ token, expires_at: tokenExpiry }) => {
      this._token = token;
      this._tokenExpiry = tokenExpiry;
    });
  }

  /**
   * Verifies that a token exists for this instance and
   * that it has not expired, otherwise a new token will be
   * requested.
   *
   * @returns {Promise}
   * @private
   */
  _ensureToken() {
    const nowInSecs = Date.now() / 1000;

    if (this._token || nowInSecs < this._tokenExpiry) {
      return Promise.resolve();
    } else {
      return this._refreshToken();
    }
  }

  /**
   * Sends an API request via fetch and handles the
   * response. If the response is "ok", then we resolve
   * with the response, otherwise we will reject the
   * Promise with an error.
   *
   * If the response content-type is in JSON, then we
   * transform the data and extract the "error" field,
   * otherwise we reject using the status text.
   *
   * @example
   *
   *   sendAPIRequest('/foo').then((response) => {
   *     // ...
   *   });
   *
   * @example
   *
   *   sendAPIRequest('/bar', {
   *     method: 'POST'
   *   }).then((response) => {
   *     // ...
   *   });
   *
   * @param {USVString} input
   * @param {Object} [init]
   * @returns {Promise.<Response>}
   * @public
   */
  sendAPIRequest(input, init = {}) {
    const url = new URL(`${config.basePath}${input}`, config.host);

    return new Promise((resolve, reject) => {
      fetch(url, Object.assign({}, init, {
        headers: Object.assign({
          'User-Agent': config.userAgent,
        }, init.headers),
      })).then((response) => {
        if (response.ok) {
          resolve(response);
        } else {
          const contentType = response.headers.get('content-type');

          if (/application\/json/.test(contentType)) {
            response.json().then(({ error }) => {
              reject(new Error(error));
            });
          } else {
            reject(new Error(response.statusText));
          }
        }
      });
    });
  }

  /**
   * Sends an API request using the current JWT as the
   * bearer token for authorization. First verifies that a
   * token exists and that it has not expired, otherwise
   * a new token will be requested before continuing with
   * the API request.
   *
   * @example
   *
   *   sendAPIRequestWithToken('/foo').then((response) => {
   *     // ...
   *   });
   *
   * @example
   *
   *   sendAPIRequestWithToken('/bar', {
   *     method: 'POST'
   *   }).then((response) => {
   *     // ...
   *   });
   *
   * @param {USVString} input
   * @param {Object} [init]
   * @returns {Promise.<Response>}
   * @public
   */
  sendAPIRequestWithToken(input, init = {}) {
    return this._ensureToken().then(() => {
      return this.sendAPIRequest(input, Object.assign({}, init, {
        headers: Object.assign({
          Authorization: `Bearer ${this._token}`,
        }, init.headers),
      }));
    });
  }
}

module.exports = HelloWorks;
