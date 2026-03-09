<template>
    <div class="w-full flex flex-col lg:flex-row gap-5 rounded-lg bg-gray-100 hover:bg-primary cursor-pointer text-black hover:text-white p-5">
        <div class="w-full">
            <h4 class="text-lg font-bold mb-2">{{ title }}</h4>
            <div class="ps-3 flex flex-col gap-2">
                <p>{{ description }}</p>
                <div class="flex gap-3">
                    <UButton
                        v-for="button in buttons"
                        :key="button.label"
                        :to="button.href"
                        target="_blank"
                        color="blue"
                        icon="i-heroicons-arrow-small-right"
                        trailing
                    >
                        {{ button.label }}
                    </UButton>
                </div>
                <p class="italic">{{ hint }}</p>
            </div>
        </div>
        <div class="thumbnail">
            <NuxtLink :to="video.href" target="_blank" class="relative">
                <img :src="video.image" alt="Video thumbnail" class="image" />
                <img src="/images/video-overlay.png" class="overlay" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Button {
    href: string;
    label: string;
}

interface Video {
    image: string;
    href: string;
}

defineProps<{
    title: string;
    description: string;
    hint: string
    buttons: Button[];
    video: Video;
}>();
</script>

<style scoped lang="css">
.thumbnail {
    @apply
        w-full
        lg:min-w-[200px]
        lg:w-[200px]
        cursor-pointer
        relative;
    ;
}

.thumbnail .image {
    @apply
        w-full
        h-auto
        rounded-lg
    ;
}

.thumbnail .overlay {
    @apply
        w-full
        h-full
        rounded-lg
        absolute
        left-0
        top-0
        object-cover
        opacity-50
        hover:opacity-75
    ;
}


</style>