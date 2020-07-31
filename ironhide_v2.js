const axios = require('axios');
const aws4 = require('aws4');
const Url = require('url');
const winston = require('./winston');
// import AWS from 'aws-sdk';
const AWS = require('aws-sdk');

const getAuthToken_v2 = async ({
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
    console.log({
        url,
        companyId,
        userName,
        userId,
        accountName,
        tokenIssuer,
        awsCredentials,
    });

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


    /* Sign Request */
    const signedRequest = aws4.sign(requestConfig);
    // const signedRequest = aws4.sign(requestConfig, awsCredentials);
    // const signedRequest = aws4.sign(requestConfig,
    //  {
    //    accessKeyId: 'ASIAXHTNH37FSPYTNLWQ',
    //    secretAccessKey: 'oSr8pLmiYZRZuPXuEQGph7cYfQXFw51KJDToj+yC',
    //    sessionToken: 'FwoGZXIvYXdzEH4aDBkNk5hLLnftWkzPdiK0AQ6puGqwdqT9I3ZxzSWDKjikBHa9XQy2BkMAgZm7EicmHiz7iOXsKNfd/WVmAWKTiEtn3UDxx993Hm6ym7IpU9QvSsfgBDNgmrhRhJRZ+qwCbIH3z649BNDl6vKPL1J0vVGRg1N+/OUh7U6wQWTLOlI/kJchBvGB+2+ZJIm203T0ag7yq/zanNEIcRTDhJhh6aNTesgva/NG7FnxS4eqExRajH5l+Zyq3AjG+BujdAoptzBj4Cjq3oz5BTItiBCSO3W+qsaacNWzg8R0TQjjh8EGqquJ18HwNl/t2vmibktdzb5RHM4bSgNE'
    //  });

    /* Send Request */
    // try {
    //     const {
    //         data: { token },
    //     } = await axios(signedRequest);
    //     return token;
    // } catch (e) {
    //     console.log(e);
    //     winston.error('Error requesting access token from iron hide ❌', e);
    //     throw e;
    // }

    var chain = new AWS.CredentialProviderChain();
    // var diskProvider = new AWS.FileSystemCredentials('./creds.json');
    var chain = new AWS.CredentialProviderChain();
    // chain.providers.push(diskProvider);
    chain.resolve(function(err, creds) {
        if (err) {
            console.log('No master credentials available');
        } else {
            console.log('Master credentials available');
            console.log(`creds=${JSON.stringify(creds)}`)
            // Set master credentials
            AWS.config.update({
                credentials: creds
            });
            // create temporary credentials
            AWS.config.update({
                credentials:  new AWS.TemporaryCredentials(/* params */)
            });
        }
    });
};

module.exports = {
    getAuthToken_v2,
};
