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

/* global
client
wait
testApiKeyId
testApiKeySecret
testEmailAddress
testWorkflowId
testCompletedInstanceId
*/

let instanceId;

beforeEach(() => {
  return client.workflowInstances.createInstance({
    workflowId: testWorkflowId,
    participants: {
      prospectEmp: {
        type: 'email',
        value: testEmailAddress,
        fullName: 'Lauren Ipsum',
      },
    },
  }).then(({ id }) => {
    instanceId = id;
  });
});

afterEach(() => {
  instanceId = null;
});

describe('Endpoints', () => {

  describe('Token', () => {

    describe('#getToken()', () => {

      test.skip('resolves with JWT token and expiry', () => {
        return expect(
          client.token.getToken({
            apiKeyId: testApiKeyId,
            apiKeySecret: testApiKeySecret,
          }),
        ).resolves.toMatchObject({
          token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
          expires_at: expect.any(Number),
        });
      });

      test.skip('rejects if invalid API credentials', () => {
        return expect(
          client.token.getToken({
            apiKeyId: 'invalid_api_key_id',
            apiKeySecret: 'invalid_api_key_secret',
          }),
        ).rejects.toThrow('Invalid API key');
      });
    });
  });

  describe('Workflow Instances', () => {

    describe('#createInstance()', () => {

      test.skip('resolves with the Workflow instance', () => {
        return expect(
          client.workflowInstances.createInstance({
            workflowId: testWorkflowId,
            participants: {
              prospectEmp: {
                type: 'email',
                value: testEmailAddress,
                fullName: 'Lauren Ipsum',
              },
            },
            mergeFields: {
              signerName_28XkWu: 'Lauren Ipsum',
            },
            metadata: {
              foo: 'bar',
            },
            callbackUrl: 'https://example.com/callback',
            redirectUrl: 'https://example.com/success',
            documentDelivery: true,
          }),
        ).resolves.toMatchObject({
          id: expect.stringMatching(/^[A-Za-z0-9]{16}$/),
          // etc...
        });
      });

      test.skip('rejects if missing Workflow ID', () => {
        return expect(
          client.workflowInstances.createInstance({
            // No Workflow ID.
            participants: {
              prospectEmp: {
                type: 'email',
                value: testEmailAddress,
                fullName: 'Lauren Ipsum',
              },
            },
            mergeFields: {
              signerName_28XkWu: 'Lauren Ipsum',
            },
          }),
        ).rejects.toThrow('Required parameter: \'workflow_id\'');
      });
    });

    describe('#getInstance()', () => {

      test.skip('resolves with the pending Workflow Instance', () => {
        return expect(
          client.workflowInstances.getInstance({
            instanceId,
          }),
        ).resolves.toMatchObject({
          id: instanceId,
          workflow_id: testWorkflowId,
          // etc...
        });
      });

      test.skip('resolves with the cancelled Workflow Instance', () => {
        return expect(
          client.workflowInstances.cancelInstance({ instanceId })
            // Wait 2.5s before fetching the instance to
            // help prevent race conditions with the
            // HelloWorks server.
            .then(() => wait(2500))
            .then(() => {
              return client.workflowInstances.getInstance({
                instanceId,
              });
            }),
        ).resolves.toMatchObject({
          id: instanceId,
          workflow_id: testWorkflowId,
          status: 'cancelled',
          // etc...
        });
      });

      test.skip('resolves with the completed Workflow Instance', () => {
        return expect(
          client.workflowInstances.getInstance({
            instanceId: testCompletedInstanceId,
          }),
        ).resolves.toMatchObject({
          id: testCompletedInstanceId,
          workflow_id: testWorkflowId,
          status: 'completed',
          // etc...
        });
      });

      test.skip('rejects if missing Workflow Instance ID', () => {
        return expect(
          client.workflowInstances.getInstance({
            // No Workflow Instance ID.
          }),
        ).rejects.toThrow('Workflow instance not found');
      });
    });

    describe('#getInstanceSteps()', () => {

      test.skip('resolves with the Workflow Instance steps', () => {
        return expect(
          client.workflowInstances.getInstanceSteps({
            instanceId,
          }),
        ).resolves.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              participant: 'Lauren Ipsum',
              // etc...
            }),
          ]),
        );
      });
    });

    describe('#getInstanceSteps()', () => {

      test('resolves with the authenticated link for the Workflow Instance step', () => {
        return expect(
          client.workflowInstances.getAuthenticatedLinkForStep({
            instanceId,
          }),
        ).resolves.toEqual(
          expect.any(String),
        );
      });
    });

    describe('#getInstanceAuditTrail()', () => {

      test.skip('resolves with the Workflow Instance audit trail', () => {
        return expect(
          client.workflowInstances.getInstanceAuditTrail({
            instanceId: testCompletedInstanceId,
          }),
        ).resolves.toEqual(expect.any(Buffer));
      });

      test.skip('rejects if Workflow Instance audit trail is not ready yet', () => {
        return expect(
          client.workflowInstances.getInstanceAuditTrail({
            instanceId,
          }),
        ).rejects.toThrow('Document not ready yet');
      });
    });

    describe('#getInstanceDocument()', () => {

      test.skip('resolves with the Workflow Instance document', () => {
        return expect(
          client.workflowInstances.getInstance({
            instanceId: testCompletedInstanceId,
          }).then(({ document_hashes: documents }) => {
            const documentId = Object.keys(documents)[0];

            return client.workflowInstances.getInstanceDocument({
              instanceId: testCompletedInstanceId,
              documentId,
            });
          }),
        ).resolves.toEqual(expect.any(Buffer));
      });

      test.skip('rejects if missing Workflow Instance document ID', () => {
        return expect(
          client.workflowInstances.getInstanceDocument({
            instanceId: testCompletedInstanceId,
          }),
        ).rejects.toThrow('Document not found');
      });
    });

    describe('#cancelInstance()', () => {

      test.skip('resolves if the instance is cancelled', () => {
        return expect(
          client.workflowInstances.cancelInstance({
            instanceId,
          }),
        ).resolves.toBe();
      });

      test.skip('rejects if the instance is already cancelled', () => {
        return expect(
          client.workflowInstances.cancelInstance({ instanceId })
            // Wait 2.5s before fetching the instance to
            // help prevent race conditions with the
            // HelloWorks server.
            .then(() => wait(2500))
            .then(() => {
              return client.workflowInstances.cancelInstance({
                instanceId,
              });
            }),
        ).rejects.toThrow('Workflow instance has been cancelled');
      });
    });
  });
});
