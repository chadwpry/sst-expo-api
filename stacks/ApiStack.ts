import { StackContext, Api, Cognito, use } from "sst/constructs";
import { EventBusStack } from "./EventBusStack";

export function ApiStack({ app, stack }: StackContext) {
  const cognito = new Cognito(stack, "cognito", {
    login: ["email"],
  });

  const domainPrefix = "sst-expo-api-597288"

  // cognito.cdk.userPool.addClient("userPoolClient", {
  //   oAuth: {
  //     callbackUrls: [
  //       "exp://192.168.86.25:8081"
  //     ],
  //   },
  // });

  cognito.cdk.userPool.addDomain("userPoolCognitoDomain", {
    cognitoDomain: {
      domainPrefix: domainPrefix,
    },
  });

  const { bus } = use(EventBusStack);

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
        function: "packages/functions/src/lambda.handler",
      },
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    Region: app.region,
    UserPoolId: cognito.userPoolId,
    UserPoolDomainPrefix: domainPrefix,
    UserPoolClientId: cognito.userPoolClientId,
    IdentityPoolId: cognito.cognitoIdentityPoolId,
  });

  return {
    api,
    cognito,
  };
};
