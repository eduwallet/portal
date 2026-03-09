<template>
  <h3 class="title">{{ title }}</h3>
  <div class="container">
    <div class="left">
      <div class="header">
        <div class="header-left">
          <p
            v-if="source"
            class="source"
          >
            <span>{{ $t('source') }}: </span>
            <span>{{ source }}</span>
          </p>
        </div>

        <BadgeVerified
          v-if="isVerified"
          class="badge"
        />
      </div>
      <div
        class="card"
        :class="{
          'card--with-image': image,
        }"
      >
        <dl class="claim-list">
          <template v-for="{ term, value, secret } in claims" :key="`${term}_${value}`">
            <dt class="term">
              {{ term }}
            </dt>
            <dd class="value">
              <MaskedValue
                v-if="secret"
                :value="value"
              />
              <span v-else>
                {{ value }}
              </span>
            </dd>
          </template>
        </dl>

        <div
          v-if="image"
          class="image-container"
        >
          <img
            :src="image"
            alt="Credential image"
            class="image"
          />
        </div>
      </div>
    </div>
    <div class="right">
      <CredentialActions
        :issue-options="issueOptions"
        :is-presentable="isPresentable"
        :issued-at="issuedAt"
        :is-wallet-cta-displayed="isWalletCtaDisplayed"
        :issue-url="issueUrl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  claims: {
    term: string;
    value: any;
    secret?: boolean;
  }[];
  issueOptions?: string[];
  issuedAt?: Date;
  source?: string;
  image?: string;
  isPresentable?: boolean;
  isVerified?: boolean;
  isWalletCtaDisplayed?: boolean;
  issueUrl?: string;
}>();
</script>

<style lang="css" scoped>
.title {
  @apply mb-3;
}

.container {
  @apply
    flex
    w-full
    flex-wrap
    gap-5
    mb-5
  ;
}

.left {
  @apply
    w-full
    max-w-xl
    flex-none
  ;
}

.right {
  @apply
    flex
    flex-col
    gap-3
  ;
}

.header {
  @apply
    w-full
    flex
    max-sm:flex-wrap
    gap-1
    items-start
    md:items-center
    justify-between
  ;
}

.header-left {
  @apply
    flex
    max-sm:flex-col
    sm:items-center
    gap-x-3
  ;
}

.badge {
  @apply max-sm:mt-2;
}

.source {
  @apply
    h-5
    text-gray-500
  ;
}

.source span:first-child {
  @apply font-semibold;
}

.source span:last-child {
  @apply underline;
}

.card {
  @apply
    bg-white
    border
    border-gray-300
    rounded-lg
    p-5
    text-gray-500
    text-lg
  ;
}

.card--with-image {
  @apply
    flex
    max-sm:flex-col-reverse
    justify-between
    gap-y-4
    gap-x-4
  ;
}

.claim-list {
  @apply
    grid
    sm:gap-x-12
    sm:grid-cols-[minmax(150px,_max-content)_1fr]
    ;
}

.term {
  @apply
    font-semibold
    truncate
  ;
}

.value {
  @apply
    mb-2
    last:mb-0
    truncate
  ;
}

.image-container {
  @apply
    relative
    flex-shrink-0
    max-sm:h-40
    sm:w-28
  ;
}

.image {
  @apply
    absolute
    top-0
    sm:right-0
    max-h-full
    object-contain
    rounded
  ;
}
</style>
