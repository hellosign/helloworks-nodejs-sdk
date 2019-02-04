const basePath = '/token';

const endpoint = (client) => ({

  /**
   * Retrieves a JWT token to use for further API calls.
   *
   * @example
   *
   *   getToken({
   *     apiKeyId: 'Your API key ID',
   *     apiKeySecret: 'Your API key secret'
   *   }).then((tokenObj) => {
   *     // ...
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.apiKeyId
   * @param {string} opts.apiKeySecret
   * @returns {Promise.<Object>}
   * @public
   */
  getToken({ apiKeyId, apiKeySecret }) {
    const endpointUrl = `${basePath}/${apiKeyId}`;

    return client.sendAPIRequest(endpointUrl, {
      headers: {
        Authorization: `Bearer ${apiKeySecret}`,
      },
    }).then((response) => {
      return response.json();
    }).then(({ data }) => {
      return data;
    });
  },
});

module.exports = endpoint;
