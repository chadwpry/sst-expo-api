import { Api, Bucket, Cognito, StackContext, use } from "sst/constructs";
import { EventBusStack } from "./EventBusStack";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import os from 'os';

export function ApiStack({ app, stack }: StackContext) {
  const mobileScheme = 'expo-template://';

  const userPool = new UserPool(stack, "UserPool", {
    selfSignUpEnabled: true,
    signInCaseSensitive: false,
    signInAliases: {
      email: true,
    },
    userPoolName: app.logicalPrefixedName('cognito'),
  });

  const nics = os.networkInterfaces();
  const callbackUrls = [];

  if (nics.en0) {
    const ip4 = nics.en0.find((nic) => nic.family === 'IPv4');

    if (ip4) {
      callbackUrls.push(mobileScheme);
    }
  }

  const userPoolClient = new UserPoolClient(stack, "UserPoolClient", {
    oAuth: {
      callbackUrls: callbackUrls,
    },
    userPool: userPool,
  });

  const cognito = new Cognito(stack, "cognito", {
    login: ["email"],
    cdk: {
      userPool: userPool,
      userPoolClient: userPoolClient,
    }
  });

  const domainPrefix = Buffer.from(`${app.stageName}-${app.name}`).toString('hex')

  cognito.cdk.userPool.addDomain("userPoolCognitoDomain", {
    cognitoDomain: {
      domainPrefix: domainPrefix,
    },
  });

  const { bus } = use(EventBusStack);

  const bucket = new Bucket(stack, app.logicalPrefixedName(app.name));

  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": {
        authorizer: "none",
        function: "packages/functions/src/root.check",
      },
      "GET /todos": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
      "GET /profile": "packages/functions/src/profile.get",
      "PUT /profile": "packages/functions/src/profile.put",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    Region: app.region,
    UserPoolId: cognito.userPoolId,
    UserPoolHostUrl: `https://${domainPrefix}.auth.${app.region}.amazoncognito.com`,
    UserPoolClientId: cognito.userPoolClientId,
    IdentityPoolId: cognito.cognitoIdentityPoolId,
    mobileScheme,
  });

  return {
    api,
    cognito,
  };
};
