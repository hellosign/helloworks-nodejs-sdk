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

const FormData = require('form-data');

const basePath = '/workflow_instances';

const endpoint = (client) => ({

  /**
   * @typedef {Object} Participant
   * @property {string} type
   * @property {string} value
   * @property {string} fullName
   */

  /**
   * Creates an instance of a Workflow.
   *
   * @example
   *
   *   createInstance({
   *     workflowId: 'Your workflow ID',
   *     participants: {
   *       signer: {
   *         type: 'email',
   *         value: 'lauren@example.com',
   *         fullName: 'Lauren Ipsum'
   *       }
   *     }
   *   }).then((instanceObj) => {
   *     // ...
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.workflowId
   * @param {Object.<Participant>} opts.participants
   * @param {Object.<string>} [opts.mergeFields]
   * @param {string} [opts.callbackUrl]
   * @param {string} [opts.redirectUrl]
   * @param {boolean} [opts.documentDelivery=false]
   * @returns {Promise.<Object>}
   * @public
   */
  createInstance(opts) {
    const form = new FormData();

    if (opts.workflowId) {
      form.append('workflow_id', opts.workflowId);
    }

    if (opts.participants) {
      Object.entries(opts.participants).forEach(([key, participant]) => {
        form.append(`participants[${key}][type]`, participant.type);
        form.append(`participants[${key}][value]`, participant.value);
        form.append(`participants[${key}][full_name]`, participant.fullName);
      });
    }

    if (opts.mergeFields) {
      Object.entries(opts.mergeFields).forEach(([key, value]) => {
        form.append(`merge_fields[${key}]`, value);
      });
    }

    if (opts.callbackUrl) {
      form.append('callback_url', opts.callbackUrl);
    }

    if (opts.redirectUrl) {
      form.append('redirect_url', opts.redirectUrl);
    }

    if (opts.documentDelivery) {
      form.append('document_delivery', 'true');
    }

    return client.sendAPIRequestWithToken(basePath, {
      method: 'POST',
      body: form,
    }).then((response) => {
      return response.json();
    }).then(({ data }) => {
      return data;
    });
  },

  /**
   * Gets the information for a Workflow instance.
   *
   * @example
   *
   *   getInstance({
   *     instanceId: 'Your instance ID'
   *   }).then((instanceObj) => {
   *     // ...
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.instanceId
   * @returns {Promise.<Object>}
   * @public
   */
  getInstance({ instanceId }) {
    const endpointUrl = `${basePath}/${instanceId}`;

    return client.sendAPIRequestWithToken(endpointUrl).then((response) => {
      return response.json();
    }).then(({ data }) => {
      return data;
    });
  },

  /**
   * @typedef {Object} Step
   * @property {string} step
   * @property {string} role
   * @property {string} participant
   * @property {string} url
   */

  /**
   * Get the steps for a Workflow instance.
   *
   * @example
   *
   *   getInstanceSteps({
   *     instanceId: 'Your instance ID'
   *   }).then((stepsArr) => {
   *     // ...
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.instanceId
   * @returns {Promise.<Step[]>}
   * @public
   */
  getInstanceSteps({ instanceId }) {
    const endpointUrl = `${basePath}/${instanceId}/steps`;

    return client.sendAPIRequestWithToken(endpointUrl).then((response) => {
      return response.json();
    }).then(({ data }) => {
      return data;
    });
  },

  /**
   * Gets the Workflow instance audit trail in PDF format.
   *
   * @example
   *
   *   getInstanceAuditTrail({
   *     instanceId: 'Your instance ID'
   *   }).then((buffer) => {
   *     fs.writeFile('file.pdf', buffer, (err) => {
   *       // ...
   *     });
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.instanceId
   * @returns {Promise.<Buffer>}
   * @public
   */
  getInstanceAuditTrail({ instanceId }) {
    const endpointUrl = `${basePath}/${instanceId}/audit_trail`;

    return client.sendAPIRequestWithToken(endpointUrl).then((response) => {
      return response.buffer();
    });
  },

  /**
   * Gets a document from a Workflow instance in PDF format.
   *
   * @example
   *
   *   getInstanceDocument({
   *     instanceId: 'Your instance ID',
   *     documentId: 'Your instance document ID'
   *   }).then((buffer) => {
   *     fs.writeFile('file.pdf', buffer, (err) => {
   *       // ...
   *     });
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.instanceId
   * @param {string} opts.documentId
   * @returns {Promise.<Buffer>}
   * @public
   */
  getInstanceDocument({ instanceId, documentId }) {
    const endpointUrl = `${basePath}/${instanceId}/documents/${documentId}`;

    return client.sendAPIRequestWithToken(endpointUrl).then((response) => {
      return response.buffer();
    });
  },

  /**
   * Cancels a Workflow instance.
   *
   * @example
   *
   *   cancelInstance({
   *     instanceId: 'Your instance ID'
   *   }).then(() => {
   *     // ...
   *   });
   *
   * @param {Object} opts
   * @param {string} opts.instanceId
   * @returns {Promise}
   * @public
   */
  cancelInstance({ instanceId }) {
    const endpointUrl = `${basePath}/${instanceId}/cancel`;

    return client.sendAPIRequestWithToken(endpointUrl, {
      method: 'PUT',
    }).then(() => {
      // Intentionally void resolution.
    });
  },
});

module.exports = endpoint;
