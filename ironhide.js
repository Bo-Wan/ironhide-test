const axios = require('axios');
const aws4 = require('aws4');
const Url = require('url');
const winston = require('./winston');
const AWS = require('aws-sdk');

const getAuthToken = async ({
                                url,
                                companyId,
                                userName,
                                userId,
                                accountName,
                                tokenIssuer,
                                awsCredentials,
                            }) => {
    const data = {
        companyId,
        userName,
        userId,
        name: accountName,
        iss: tokenIssuer,
    };
    const ironhideApiUrl = Url.parse(url);
    const region = process.env.AWS_REGION;

    const requestConfig = {
        host: ironhideApiUrl.host,
        method: 'POST',
        url,
        data,
        body: JSON.stringify(data),
        path: '/impersonate',
        service: 'execute-api',
        region,
        headers: {
            'Content-Type': 'application/vnd.whispir.message-v1+json',
        },
    };

    // TODO Get creds
    if(!awsCredentials) {
        const chain = new AWS.CredentialProviderChain();
        chain.resolve(async function(err, creds) {
            if (err) {
                console.log('No master credentials available');
            } else {
                console.log('Master credentials available');
                // console.log(`creds=${JSON.stringify(creds)}`)
                // Set master credentials
                AWS.config.update({
                    credentials: creds
                });
                // create temporary credentials
                AWS.config.update({
                    credentials:  new AWS.TemporaryCredentials(/* params */)
                });
                awsCredentials = creds;
                // console.log('creds=' + JSON.stringify(creds))
                ////////////

                const signedRequest = aws4.sign(requestConfig, awsCredentials);

                try {
                    const {
                        data: { token },
                    } = await axios(signedRequest);
                    return token;
                } catch (e) {
                    // console.log(e);
                    winston.error('Error requesting access token from iron hide ❌', e);
                    throw e;
                }
            }
        });
    }
    console.log('awsC=' + JSON.stringify(awsCredentials));
};

module.exports = {
    getAuthToken,
};
