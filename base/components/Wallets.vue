<template>
  <UContainer class="h-full pb-8">
    <div class="flex justify-between items-center">
        <h1>{{ $t('_wallet.download') }}</h1>
        <UButton
            v-if="!route.path.includes('/wallet')"
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="flex"
            @click="emit('cancel')"
        />
    </div>

    <h2>{{ $t('_wallet.in_your_pocket') }}</h2>

    <Grid class="md:grid-cols-2">
      <Card>
        <p>
          {{ $t('_wallet.safe') }}
          <br /><br />
          {{ $t('_wallet.at_hand') }}
          <br /><br />
          <strong>{{ $t('_wallet.advantages') }}</strong>
        </p>
        <ul class="list-disc list-outside ml-5">
          <li>
            {{ $t('_wallet.identification') }}
          </li>
          <li>
            {{ $t('_wallet.collect_save_share') }}
          </li>
          <li>
            {{ $t('_wallet.save_share') }}
          </li>
        </ul>
      </Card>

      <Card class="space-y-4">
        <UAccordion
          :items="items"
          color="white"
          variant="outline"
          size="xl"
          class="gap-5"
        >
          <template #default="{ item, index, open }">
            <UButton color="gray" variant="ghost" class="border rounded-lg border-gray-200 dark:border-gray-700" :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }">
              <template #leading>
                <img
                  class="h-auto w-12"
                  :src="item.image"
                  alt=""
                />
              </template>

              <div class="text-start">
                <p class="font-bold text-lg">
                  {{ $t(item.title) }}
                </p>

                <p class="text-sm text-gray-400">
                  {{ $t(item.subtitle) }}
                </p>
              </div>
              
              <template #trailing>
                <UIcon
                  v-if="!item.disabled"
                  name="i-heroicons-chevron-down-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-180']"
                />
                <UButton
                  v-else
                  color="gray"
                  variant="soft"
                  disabled
                  class="max-md:hidden max-lg:ml-16 ms-auto -me-3"
                >
                  {{ $t('soon') }}
                </UButton>
              </template>
            </UButton>
          </template>

          <template #wwwallet>
            <div class="max-sm:text-center p-5">
              <p class="text-xl font-bold mb-6">
                {{ $t('download.scan') }}
              </p>

              <div class="flex flex-wrap max-sm:justify-center gap-6">
                <div v-if="deploymentStage" class="space-y-1">
                  <NuxtLink
                    :to="`https://wwwallet.${deploymentStage}.eduwallet.nl`"
                  >
                    <QrcodeSvg
                        :value="`https://wwwallet.${deploymentStage}.eduwallet.nl`"
                        :size="120"
                    />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>

          <template #sphereon>
            <div class="max-sm:text-center p-5">
              <p class="text-xl font-bold mb-6">
                {{ $t('download.scan') }}
              </p>

              <div class="flex flex-wrap max-sm:justify-center gap-6">
                <div class="space-y-1">
                  <img
                    class="bg-black p-1 rounded w-full"
                    src="@surf/nuxt-base/assets/images/app-store-ios.png"
                    :alt="$t('download.app_store')"
                  />

                  <img
                    class="w-full"
                    src="@surf/nuxt-base/assets/images/app-store-ios-sphereon-qr-code.png"
                    :alt="$t('download.app_store')"
                  />
                </div>

                <div class="space-y-1">
                  <img
                    class="bg-black p-1 rounded w-full"
                    src="@surf/nuxt-base/assets/images/app-store-android.png"
                    :alt="$t('download.play_store')"
                  />

                  <img
                    class="w-full"
                    src="@surf/nuxt-base/assets/images/app-store-android-sphereon-qr-code.png"
                    :alt="$t('download.play_store')"
                  />
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
      </Card>
    </Grid>
  </UContainer>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { useEnvironmentStore } from '@surf/nuxt-base/stores/environment';
import QrcodeSvg from 'qrcode.vue';

const environmentStore = useEnvironmentStore();

onMounted(async () => {
  if (!environmentStore.variables.length) {
    await environmentStore.fetchVariables();
  }
});

const deploymentStage = computed(() => {
  return environmentStore.variables.find(v => v.key === 'deploymentStage')?.value || '';
});

const route = useRoute();
const emit = defineEmits(['cancel']);

const items = [{
  title: 'vendor.wwwallet.wallet',
  subtitle: 'vendor.wwwallet.company',
  image: '/images/wallet-wwwallet.png',
  slot: 'wwwallet'
}, {
  title: 'vendor.sphereon.wallet',
  subtitle: 'vendor.sphereon.company',
  image: '/images/wallet-sphereon.png',
  slot: 'sphereon',
  disabled: true,
}, {
  title: 'vendor.paradym.wallet',
  subtitle: 'vendor.paradym.company',
  image: '/images/wallet-paradym.jpg',
  disabled: true,
}, {
  title: 'vendor.unime.wallet',
  subtitle: 'vendor.unime.company',
  image: '/images/wallet-unime.png',
  disabled: true,
}, {
  title: 'vendor.edi.wallet',
  subtitle: 'vendor.edi.company',
  image: '/images/wallet-nl-edi.png',
  disabled: true,
}];
</script>

