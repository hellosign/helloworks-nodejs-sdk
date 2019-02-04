/* global client testApiKeyId testApiKeySecret testWorkflowId testCompletedInstanceId */

let instanceId;

beforeEach(() => {
  return client.workflowInstances.createInstance({
    workflowId: testWorkflowId,
    participants: {
      prospectEmp: {
        type: 'email',
        value: 'lauren@example.com',
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

      test('resolves with JWT token and expiry', () => {
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

      test('rejects if invalid API credentials', () => {
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

      test('resolves with the Workflow instance', () => {
        return expect(
          client.workflowInstances.createInstance({
            workflowId: testWorkflowId,
            participants: {
              prospectEmp: {
                type: 'email',
                value: 'lauren@example.com',
                fullName: 'Lauren Ipsum',
              },
            },
            mergeFields: {
              signerName_28XkWu: 'Lauren Ipsum',
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

      test('rejects if missing Workflow ID', () => {
        return expect(
          client.workflowInstances.createInstance({
            // No Workflow ID.
            participants: {
              prospectEmp: {
                type: 'email',
                value: 'lauren@example.com',
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

      test('resolves with the pending Workflow Instance', () => {
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

      test('resolves with the cancelled Workflow Instance', () => {
        return expect(
          client.workflowInstances.cancelInstance({
            instanceId,
          }).then(() => {
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

      test('resolves with the completed Workflow Instance', () => {
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

      test('rejects if missing Workflow Instance ID', () => {
        return expect(
          client.workflowInstances.getInstance({
            // No Workflow Instance ID.
          }),
        ).rejects.toThrow('Workflow instance not found');
      });
    });

    describe('#getInstanceSteps()', () => {

      test('resolves with the Workflow Instance steps', () => {
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

    describe('#getInstanceAuditTrail()', () => {

      test('resolves with the Workflow Instance audit trail', () => {
        return expect(
          client.workflowInstances.getInstanceAuditTrail({
            instanceId: testCompletedInstanceId,
          }),
        ).resolves.toEqual(expect.any(Buffer));
      });

      test('rejects if Workflow Instance audit trail is not ready yet', () => {
        return expect(
          client.workflowInstances.getInstanceAuditTrail({
            instanceId,
          }),
        ).rejects.toThrow('Document not ready yet');
      });
    });

    describe('#getInstanceDocument()', () => {

      test('resolves with the Workflow Instance document', () => {
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

      test('rejects if missing Workflow Instance document ID', () => {
        return expect(
          client.workflowInstances.getInstanceDocument({
            instanceId: testCompletedInstanceId,
          }),
        ).rejects.toThrow('Document not found');
      });
    });

    describe('#cancelInstance()', () => {

      test('resolves if the instance is cancelled', () => {
        return expect(
          client.workflowInstances.cancelInstance({
            instanceId,
          }),
        ).resolves.toBe();
      });

      test('rejects if the instance is already cancelled', () => {
        return expect(
          client.workflowInstances.cancelInstance({
            instanceId,
          }).then(() => {
            return client.workflowInstances.cancelInstance({
              instanceId,
            });
          }),
        ).rejects.toThrow('Workflow instance has been cancelled');
      });
    });
  });
});
