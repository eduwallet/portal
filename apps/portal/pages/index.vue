<template>
    <h1
        v-if="portalStore.firstName"
        class="mt-8 text-black"
    >
        {{ $t('welcome_first_name', { name: portalStore.firstName }) }}
    </h1>
    <div v-if="!pilotId">
        <div class="flex flex-col gap-8">
            <div class="w-full flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-2/3">
                    <h4 class="text-black">{{ $t('it_seems_like_you_are_not_signed_up_for_any_pilot') }}</h4>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="flex flex-col gap-8">
            <div class="w-full flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-2/3">
                    <h4 class="text-black">{{ $t('thank_you_for_participating') }}</h4>
                    <p class="mb-4" v-html="$t('_welcome.1')"></p>
                    <h4 class="text-black">{{ $t('about_the_eduwallet') }}</h4>
                    <p class="mb-4" v-html="$t('_welcome.2')"></p>
                    <p v-html="$t('_wallet3.advantages')"></p>
                    <ul class="list-disc list-inside mb-4">
                        <li>{{ $t('_wallet3.in_your_pocket') }}</li>
                        <li>{{ $t('_wallet3.identification') }}</li>
                        <li>{{ $t('_wallet3.at_hand') }}</li>
                    </ul>
                    <p class="mb-4" v-html="$t('_welcome.3')"></p>
                </div>
                <div class="w-full lg:w-1/3 px-8 py-8 flex items-center justify-center rounded-lg bg-primary-100">
                    <img
                        src="/images/diploma.svg"
                        class="w-full lg:w-2/3"
                    />
                </div>
            </div>
        </div>
        <h2 class="mt-8 text-black">
            {{ $t('checklist') }}
        </h2>
        <div class="flex flex-col gap-8">
            <div class="w-full flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-2/3">
                    <div class="w-full rounded-lg bg-primary-100 p-8 mb-8 flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
                        <div class="w-full md:w-2/3">
                            <h4 class="text-black mb-4">1. {{ $t('_checklist.1.title') }}</h4>
                            <p class="ps-6">{{ $t('_checklist.1.description') }}</p>
                        </div>
                        <div class="w-full md:w-48 flex flex-col items-center">
                            <img
                                src="/images/phone.svg"
                                class="h-16 mb-4"
                            />
                            <UButton
                                block
                                color="blue"
                                size="lg"
                                class="whitespace-nowrap"
                                @click="handleWalletsModalOpenClick()" 
                            >
                                {{ $t('show_wallets') }}
                            </UButton>
                            <UModal v-model="isWalletsModalOpen" :ui="{ width: 'w-full sm:max-w-6xl' }">
                                <Wallets @cancel="isWalletsModalOpen=false" />
                            </UModal>
                        </div>
                    </div>
                    <div class="w-full rounded-lg bg-primary-100 p-8 mb-8 flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
                        <div class="w-full md:w-2/3">
                            <h4 class="text-black mb-4">2. {{ $t('_checklist.2.title') }}</h4>
                            <p class="ps-6">{{ $t('_checklist.2.description') }}</p>
                        </div>
                        <div class="w-full md:w-48 flex justify-center items-center">
                            <InlineIssuanceAuthorizationCodeFlow
                                credential-type="eduIdAcf"
                                image="/images/eduid-phone.svg"
                                @change="(data: (object | null)) => handleEduIdChange(data)"
                            />
                        </div>
                    </div>
                    <div class="w-full rounded-lg bg-primary-100 p-8 mb-8 flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
                        <div class="w-full md:w-2/3">
                            <h4 class="text-black mb-4">3. {{ $t('_checklist.3.title') }}</h4>
                            <p class="ps-6">{{ $t('_checklist.3.description') }}</p>
                        </div>
                        <div class="w-full md:w-48 flex justify-center items-center">
                            <InlineIssuanceAuthorizationCodeFlow
                                credential-type="entitlement"
                                image="/images/participation-phone.svg"
                                :payload="{
                                    entitlement: pilotId,
                                }"
                                :disabled="!isEduidIssued"
                                @change="(data: (object | null)) => handleEntitlementChange(data)"
                            />
                        </div>
                    </div>
                    <div class="w-full rounded-lg bg-primary-100 p-8 mb-8 flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
                        <div class="w-full md:w-2/3">
                            <h4 class="text-black mb-4">4. {{ $t('_checklist.4.title') }}</h4>
                            <p class="ps-6">{{ $t('_checklist.4.description') }}</p>
                        </div>
                        <div class="w-full md:w-48 flex flex-col items-center">
                            <img
                                src="/images/accept.svg"
                                class="h-16 mb-4"
                            />
                            <UButton
                                block
                                :color="isDataChecked ? 'blue' : 'gray'"
                                size="lg"
                                class="whitespace-nowrap"
                                :icon="isDataChecked ? 'i-heroicons-check-circle-solid' : 'mdi-circle-outline'"
                                :disabled="!isEduidIssued || !isEntitlementIssued"
                                @click="isDataChecked = !isDataChecked"
                            >
                                {{ $t('i_understand') }}
                            </UButton>
                        </div>
                    </div>
                </div>
                <div
                    v-if="allDone"
                    class="w-full lg:w-1/3"
                >
                    <div class="w-full px-8 py-6 rounded-lg bg-yellow-100">
                        <h4 class="text-black mb-4">{{ $t('great_you_are_ready') }}</h4>
                        <p class="mb-4" v-html="$t('ready_for_the_pilot')"></p>
                        <p class="mb-4" v-html="$t('pilot_info_provided_by', { institution: portalStore.institution })"></p>
                        <UButton
                            :to="portalStore.pilotLink"
                            block
                            color="primary"
                            size="lg"
                        >
                            {{ $t('start_the_pilot') }}
                        </UButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UButton } from '#components';
import { usePortalStore } from '@surf/nuxt-base/stores/portal';
import * as jose from 'jose'

const { loggedIn, user, logout } = useOidcAuth();

const portalStore = usePortalStore();

definePageMeta({
  layout: 'portal'
});

const isWalletsModalOpen = ref(false);
const pilotId = ref('');

const isWalletsModalOpenClicked = ref(false);
const isEduidIssued = ref(false);
const isEntitlementIssued = ref(false);
const isDataChecked = ref(false);

const allDone = computed(() => {
    return isEduidIssued.value && isEntitlementIssued.value && isDataChecked.value;
});

const pilots = [
  {
    id: 'eduwallet_pilot_deelnemer_dev',
    institute: 'Koning Willem I College',
    pilot: 'Machine Safety',
    url: 'https://www.kw1c.nl/pilots/eduwallet_machien_safety',
  },
  {
    id: 'eduwallet_pilot_kw1c_machine_safety',
    institute: 'Koning Willem I College',
    pilot: 'Machine Safety',
    url: 'https://www.kw1c.nl/pilots/eduwallet_machien_safety',
  },
];

watchEffect(() => {
    if (loggedIn.value) {
        console.log(user.value)
        const claims = jose.decodeJwt(user.value.idToken);
        console.log(claims);
        pilotId.value = claims.edumember_is_member_of?.[0] || '';
        const pilot = pilots.find(p => pilotId.value.endsWith(p.id));
        portalStore.$patch({
            firstName: user.value.claims.given_name,
            fullName: `${user.value.claims.given_name} ${user.value.claims.family_name}`,
            pilotLink: pilot?.url || '',
            institution: pilot?.institute || '',
        });
    } else {
        portalStore.$reset();
    }
});

const handleWalletsModalOpenClick = () => {
    isWalletsModalOpen.value = true;
    isWalletsModalOpenClicked.value = true;
};

const handleEduIdChange = (data: object | null) => {
    if (data !== null) {
        isEduidIssued.value = true;
    }
};

const handleEntitlementChange = (data: object | null) => {
    if (data !== null) {
        isEntitlementIssued.value = true;
    }
};
</script>