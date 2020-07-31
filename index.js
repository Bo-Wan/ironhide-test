require('dotenv').config({path: __dirname + '/.env'});
const { getAuthToken } = require('./ironhide');

(async () => {
    // const jwt = await getAuthToken_v2({
    const jwt = await getAuthToken({
        url: 'https://auth.stage-ap-southeast-2.iac-whispir.net/impersonate',
        companyId: '64',
        userName: 'cadmin',
        userId:'90012',
        accountName: 'acc1',
        tokenIssuer: 'https://stage-ap-southeast-2.whispirdev.com',
        awsCredentials: null,
    });

    console.log(`jwt:${jwt}`);
})();

