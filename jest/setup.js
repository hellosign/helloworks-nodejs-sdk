const HelloWorks = require('../');

const testApiKeyId = process.env.HW_API_KEY_ID;
const testApiKeySecret = process.env.HW_API_KEY_SECRET;
const testEmailAddress = process.env.HW_TEST_EMAIL_ADDRESS;
const testWorkflowId = process.env.HW_TEST_WORKFLOW_ID;
const testCompletedInstanceId = process.env.HW_TEST_COMPLETED_INSTANCE_ID;

const wait = (waitMs) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitMs);
  });
};

const client = new HelloWorks({
  apiKeyId: testApiKeyId,
  apiKeySecret: testApiKeySecret,
});

global.testApiKeyId = testApiKeyId;
global.testApiKeySecret = testApiKeySecret;
global.testEmailAddress = testEmailAddress;
global.testWorkflowId = testWorkflowId;
global.testCompletedInstanceId = testCompletedInstanceId;
global.client = client;
global.wait = wait;
