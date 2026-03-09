<template>
  <div class="pt-12 flex flex-col gap-3 items-center max-w-xs mx-auto">
    <p
      v-if="step"
      class="text-center mb-4 text-2xl font-bold"
    >
      {{ $t('step_number', { number: step }) }}
    </p>

    <CredentialIssuance
      :credential-type="credentialType?.toString() || ''"
      :credential-type-next="credentialTypeNext?.toString() || ''"
      :credential="credential?.toString() || ''"
      :key="$route.fullPath"
      @cancel="$router.back"
      @success="async () => {
        const url = (returnUrl || '').toString();
        if (url.includes('/add-to-wallet')) {
          $router.push(url);
        } else {
          finished = true;
        }
      }"
    />

    <div
      v-if="finished"
      class="p-4 border rounded-md w-full flex flex-col gap-5 items-center"
    >
      <div
        class="bg-gray-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-8"
      >
        <UIcon
          name="i-heroicons-check"
          class="rounded-full text-green-500"
          size="80"
        />
      </div>

      <ProgressButton :action="() => $router.push((returnUrl || '/').toString())">
        {{ $t('successfully_sent') }}
      </ProgressButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const credentialType = ref(route.query.credentialType);
const step = ref(route.query.step);
const returnUrl = ref(route.query.returnUrl);
const credential = ref(route.query.credential);
const credentialTypeNext = ref(new URLSearchParams(route.query.returnUrl).get('credentialType') || '');

watch(
  () => route.query,
  (newQuery) => {
    credentialType.value = newQuery.credentialType
    step.value = newQuery.step
    returnUrl.value = newQuery.returnUrl
    credential.value = newQuery.credential
    credentialTypeNext.value = new URLSearchParams(newQuery.returnUrl).get('credentialType') || '';
  }
);

const finished = ref(false);
</script>
