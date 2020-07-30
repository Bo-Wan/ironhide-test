const axios = require('axios');
const aws4 = require('aws4');
const Url = require('url');
const winston = require('../../config/winston');

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

  // const signedRequest = aws4.sign(requestConfig, awsCredentials);
  const signedRequest = aws4.sign(requestConfig,
    {
      accessKeyId: 'ASIAXHTNH37FSPYTNLWQ',
      secretAccessKey: 'oSr8pLmiYZRZuPXuEQGph7cYfQXFw51KJDToj+yC',
      sessionToken: 'FwoGZXIvYXdzEH4aDBkNk5hLLnftWkzPdiK0AQ6puGqwdqT9I3ZxzSWDKjikBHa9XQy2BkMAgZm7EicmHiz7iOXsKNfd/WVmAWKTiEtn3UDxx993Hm6ym7IpU9QvSsfgBDNgmrhRhJRZ+qwCbIH3z649BNDl6vKPL1J0vVGRg1N+/OUh7U6wQWTLOlI/kJchBvGB+2+ZJIm203T0ag7yq/zanNEIcRTDhJhh6aNTesgva/NG7FnxS4eqExRajH5l+Zyq3AjG+BujdAoptzBj4Cjq3oz5BTItiBCSO3W+qsaacNWzg8R0TQjjh8EGqquJ18HwNl/t2vmibktdzb5RHM4bSgNE'
    });

  try {
    const {
      data: { token },
    } = await axios(signedRequest);
    return token;
  } catch (e) {
    winston.error('Error requesting access token from iron hide ❌', e);
    throw e;
  }
};

module.exports = {
  getAuthToken,
};
