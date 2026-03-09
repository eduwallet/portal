import { defineStore } from 'pinia';

export interface Token {
  appName: string;
  token: string;
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    tokens: [] as Token[],
  }),

  getters: {
    token: (state) => {
      const { appName } = useAppConfig();
      return state.tokens.find(t => t.appName === appName)?.token || '';
    },
  },

  persist: true,
});
