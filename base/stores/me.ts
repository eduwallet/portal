import { defineStore } from 'pinia';
import { useSessionStore } from './session';
import type { Persona } from '@surf/nuxt-base/server/api/personas/types';

export const useMeStore = defineStore('me', {
  state: () => ({
    me: null as Persona | null,
    hasFetchedMe: false,
  }),

  actions: {
    async fetchMe() {
      const sessionStore = useSessionStore();

      try {
        this.me = await $fetch<Persona>('/api/me', {
          headers: {
            Authorization: `Bearer ${sessionStore.token}`,
          }
        });
        this.hasFetchedMe = true;
      } catch (e) {
        this.me = null;
        this.hasFetchedMe = false;
      }
    },

    resetMe() {
      this.me = null;
      this.hasFetchedMe = false;
    }
  },
});
