<template>
  <div class="flex flex-col gap-8">
    <div class="w-full mt-3 lg:mt-12 flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-1/2 px-8 pb-8 ">
            <h1 class="text-black">{{ $t('brand') }}</h1>
            <ul class="ps-5 list-disc list-outside text-xl leading-loose">
              <li>{{ $t('_login.1') }}</li>
              <li>{{ $t('_login.2') }}</li>
              <li>{{ $t('_login.3') }}</li>
            </ul>
        </div>
        <div class="w-full lg:w-1/2 px-8 py-8 flex items-center justify-center rounded-lg bg-primary-100">
            <img
                src="/images/diploma.svg"
                class="w-full lg:w-2/3"
            />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'portal',
});
</script>
