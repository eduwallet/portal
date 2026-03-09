import { defineStore } from 'pinia';

export interface IssuedCredential {
    type: string;
    issuedAt: Date;
    credential: any;
}

export const useIssuedCredentialStore = defineStore('issued-credential', {
    state: () => ({
        issuedCredentials: [] as IssuedCredential[],
    }),
    getters: {
        getByType: (state) => (t: string) => state.issuedCredentials.filter(c => c.type === t)
    },
    actions: {
        addIssuedCredential(issuedCredential: IssuedCredential) {
            this.issuedCredentials.push(issuedCredential)
        },
    },
    persist: true,
});
