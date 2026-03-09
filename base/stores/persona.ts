import { defineStore } from 'pinia';
import type { Persona } from '@surf/nuxt-base/server/api/personas/types';
import { useSessionStore } from './session';

export const usePersonaStore = defineStore('persona', {
    state: () => ({
        personas: [] as Persona[],
        selectedPersona: null as Persona | null,
    }),
    getters: {
        getPersonaByPid: (state) => (id: string) => state.personas.find((p: Persona) => p.BSN === id),
        getPersonaById: (state) => (id: string) => state.personas.find((p: Persona) => p._ID === id),
    },
    actions: {
        async fetchPersonas(institutionShortCode: string = 'uvh') {
            const config = useRuntimeConfig();
            const sessionStore = useSessionStore();

            if (config.public.appType !== 'registration' && !sessionStore.token) return;

            try {
                this.personas = await $fetch(`/api/personas?institutionShortCode=${institutionShortCode}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStore.token}`,
                    }
                });
            } catch {
                this.personas = [];
            }
        },
    },
    persist: {
        pick: ['selectedPersona']
    },
});
