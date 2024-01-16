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
security using Amazon Cognito.

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

### Start development environment

```bash
$ cd sst-expo-api
$ bun install
$ bun run dev
```


## Mobile

React Native application using Expo. The application uses the design framework
Tamagui in the [packages/tamagui-frontend](https://github.com/chadwpry/sst-expo-api/tree/main/packages/tamagui-frontend)
directory.

### Start development environment

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
