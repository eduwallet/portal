<template>
  <div class="badge-verified">
    <UIcon
      name="i-heroicons-check-16-solid"
      class="badge-verified__icon"
    />
    {{ $t('verified') }}
  </div>
</template>

<style lang="css" scoped>
.badge-verified {
  @apply
    w-fit
    flex
    items-center
    gap-1
    bg-primary-800
    px-2
    py-1
    rounded-md
    text-sm
    text-white
    font-semibold
  ;
}

.badge-verified__icon {
  @apply mt-1;
}
</style>