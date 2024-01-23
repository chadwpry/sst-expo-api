---

This is a template for building an Expo application connected to an SST Api.
The project is built using the bun JavaScript runtime. It has not been tested
using pnpm or npm, only bun. More can be found on
[setting up bun](https://bun.sh/) and other frameworks in this project at the
end of this document.

Install the project using the following git command:


```bash
$ git clone https://github.com/chadwpry/sst-expo-api.git
```


## Api

SST Api that includes two stacks, EventBus and Api.  The Api includes a Todo
model and can fetch a list of random items or create a new random item. It is
secured using Amazon Cognito.

1. EventBus - distributed processing of events
2. Api - REST Api secured by a Cognito JWT implementation

### Available endpoints

- GET /todos
  [stack](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/stacks/ApiStack.ts#L73)
  [impl](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/packages/functions/src/todo.ts#L13C5-L13C5)
- POST /todo
  [stack](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/stacks/ApiStack.ts#L74)
  [impl](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/packages/functions/src/todo.ts#L4)
- GET /
  [stack](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/stacks/ApiStack.ts#L69)
  [impl](https://github.com/chadwpry/sst-expo-api/blob/0362d6e3e5c6443ba389b8abbb0af004bca41c43/packages/functions/src/root.ts#L3)
- POST /profile
  [stack](https://github.com/chadwpry/sst-expo-api/blob/3ed6190690541fe598bb261d30b497f242d206ed/stacks/ApiStack.ts#L79)
  [impl](https://github.com/chadwpry/sst-expo-api/blob/3ed6190690541fe598bb261d30b497f242d206ed/packages/functions/src/profile.ts#L8)

### Start development environment

```bash
$ cd sst-expo-api
$ bun install
$ bun run dev
```


## Mobile -> /apps/expo-app

React Native application using Expo. The application uses the design framework
Tamagui in the [packages/tamagui-frontend](https://github.com/chadwpry/sst-expo-api/tree/main/apps/expo-app)
directory.

### Create an expo development build

Generate a new eas.json using the eas.json.template. Transfer exports from SST
ApiStack and CognitoStack variables into the eas.json. Exports can be found
after creating the initial SST environment.

***Hint: exports can also be found in /.sst/outputs.json***

```json
{
  "EXPO_PUBLIC_USER_POOL_CLIENT_ID": "",
  "EXPO_PUBLIC_USER_POOL_ID": "",
  "EXPO_PUBLIC_REGION": "us-east-1",
  "EXPO_PUBLIC_USER_POOL_HOST_URL": "",
  "EXPO_PUBLIC_API_ENDPOINT": "",
  "EXPO_PUBLIC_IDENTITY_POOL_ID": ""
}
```

Next, create a development build of the ios or android client. This can be
done by executing one of the following two commands.

Note the difference:

The first command will run in the [EAS cloud](https://expo.dev/eas). It 
requires you create an expo account. A free account exists, so this should not
be any payment required to get started.

The second is to run builds locally. More detail can be found in the expo docs 
at [creating a development build](https://docs.expo.dev/develop/development-builds/create-a-build/).

```bash
eas build --platform ios --profile development
```

```bash
eas build --platform ios --profile development --local
```

Lastly deploy the development build, either from the cloud or local, to a
simulator or a physical device. Launch the development build application
and reference the next step for starting the local development environment.
This development environment is where the development build will connect to
serve the application.


### Start expo development environment "expo dev client"

```bash
$ cd sst-expo-api/packages/tamagui-frontend
$ bun run start
```

### Create Cognito user

Create and verify a new user within Cognito. Usage information can be found by
running the following command.

```bash
$ bun run cognito:user
```


## References

Links to libraries and frameworks included in the project.

- [**SST**](https://docs.sst.dev/)
- [**Expo**](https://docs.expo.dev/)
- [**React Native**](https://reactnative.dev/)
- [**Tamagui**](https://tamagui.dev/)
- [**bun**](https://bun.sh/)
- [**date-fns**](https://date-fns.org/)
- [**Faker**](https://fakerjs.dev/)
