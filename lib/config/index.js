const pkg = require('../../package.json');

module.exports = {
  host: process.env.HW_HOST || 'https://api.helloworks.com',
  basePath: '/v3',
  userAgent: `HelloWorks-NodeJS-SDK/${pkg.version}`,
};
