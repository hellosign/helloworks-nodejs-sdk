/**
 * Copyright 2019 HelloSign
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
