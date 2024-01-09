import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { EventBusStack } from "./stacks/EventBusStack";

export default {
  config(_input) {
    return {
      name: "expo-auth-cognito",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app
      .stack(EventBusStack)
      .stack(ApiStack)
  }
} satisfies SSTConfig;
