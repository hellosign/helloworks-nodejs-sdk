const HelloWorks = require('../');

const testApiKeyId = process.env.HW_API_KEY_ID;
const testApiKeySecret = process.env.HW_API_KEY_SECRET;
const testWorkflowId = process.env.HW_TEST_WORKFLOW_ID;
const testCompletedInstanceId = process.env.HW_TEST_COMPLETED_INSTANCE_ID;

const client = new HelloWorks({
  apiKeyId: testApiKeyId,
  apiKeySecret: testApiKeySecret,
});

global.testApiKeyId = testApiKeyId;
global.testApiKeySecret = testApiKeySecret;
global.testWorkflowId = testWorkflowId;
global.testCompletedInstanceId = testCompletedInstanceId;
global.client = client;
