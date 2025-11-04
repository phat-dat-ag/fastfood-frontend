import { defineStore } from "pinia";
import type { Topic } from "../types/topic.types";

export const useTopicStore = defineStore("topic", {
  state: () => ({
    topic: null as Topic | null,
  }),
  actions: {
    setTopic(newTopic: Topic) {
      this.topic = newTopic;
    },
  },
});
