<template>
  <UButton
    color="green"
    id="success-button"
    class="px-12 max-w-full bg-green-600"
    :style="{ '--animation-duration': `${durationInMs}ms` }"
    @click="action"
  >
    <slot></slot>
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps<{
  action: () => void;
  seconds?: number;
  disableAutoAction?: boolean;
}>();

const durationInMs = computed(() => {
  return props.seconds ? props.seconds * 1000 : 5000;
});

const intervalId = ref();

onMounted(() => {
  if (!props.disableAutoAction) {
    intervalId.value = setTimeout(() => props.action(), durationInMs.value);
  }
});

onBeforeUnmount(() => clearInterval(intervalId.value));
</script>

<style scoped>
#success-button {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

#success-button::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;

  z-index: -1;
  background-color: #217445; /* green-700 */

  animation-name: loading;
  animation-duration: var(--animation-duration);
  animation-timing-function: linear;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
