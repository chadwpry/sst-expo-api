import { EventHandler } from "sst/node/event-bus";
import { Todo } from "@expo-auth/core/todo";

export const handler = EventHandler(Todo.Events.Created, async (todoEvent) => {
  console.log("Todo created", todoEvent);
});
