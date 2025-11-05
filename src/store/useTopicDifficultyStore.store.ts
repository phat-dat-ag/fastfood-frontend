import { defineStore } from "pinia";
import type { TopicDifficulty } from "../types/topic-difficulty.types";

export const useTopicDifficultyStore = defineStore("topic-difficulty", {
  state: () => ({
    topicDifficulty: null as TopicDifficulty | null,
  }),
  actions: {
    setTopicDifficulty(newTopicDifficulty: TopicDifficulty) {
      this.topicDifficulty = newTopicDifficulty;
    },
  },
});
