import { defineStore } from 'pinia';
import type { Program } from '@surf/nuxt-base/server/api/programs/types';

export const useProgramStore = defineStore('program', {
    state: () => ({
        programs: [] as Program[],
    }),
    getters: {
        filterProgramsByIds: (state) => (ids: string[]): Program[] =>
            state.programs.filter((p: Program) => ids.includes(p.id)),
        filterOutProgramsByIds: (state) => (ids: string[]): Program[] =>
            state.programs.filter((p: Program) => !ids.includes(p.id)),
        getProgramById: (state) => (id: string): Program | undefined =>
            state.programs.find((p: Program) => p.id === id),
        getProgramByInstitutionId: (state) => (id: string): Program | undefined =>
            state.programs.find((p: Program) => p.id.startsWith(id)),
    },
    actions: {
        async fetchPrograms() {
            try {
                this.programs = await $fetch('/api/programs');
            } catch {
                this.programs = [];
            }
        },
    },
});
