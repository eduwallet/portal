import { defineStore } from 'pinia';
import type { Variable } from '@surf/nuxt-base/server/api/environment/types';

export const useEnvironmentStore = defineStore('environment', {
    state: () => ({
        variables: [] as Variable[],
    }),
    getters: {
        getVariableValueByKey: (state) => (key: string): string =>
            state.variables.find((v: Variable) => v.key === key)?.value || '',
    },
    actions: {
        async fetchVariables() {
            try {
                this.variables = await $fetch('/api/environment');
            } catch {
                this.variables = [];
            }
        },
    },
});
