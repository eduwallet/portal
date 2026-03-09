<template>
    <nav class="navigation">
        <div class="navigation__container-left">
            <img
                v-if="logo && imageBaseUrl"
                :src="logo"
                class="navigation__logo"
            />

            <ClientOnly>
                <NuxtLink
                    :to="localePath('/')"
                    class="navigation__brand-html"
                    v-html="$t('brand_html')"
                />
            </ClientOnly>

            <NuxtLink
                :to="localePath('/')"
                class="navigation__brand"
            >
                {{ $t('brand') }}
            </NuxtLink>
        </div>

        <div class="navigation__container-center">
            <NuxtLink
                v-for="item in menu || []"
                :key="item.href"
                :to="localePath(item.href)"
                class="navigation__link"
                activeClass="navigation__link--active"
            >
                {{ $t(item.label) }}
            </NuxtLink>
        </div>

        <div class="navigation__container-right">
            <LanguageDropdown />
            <button
                class="navigation__drawer-toggle"
                @click="isMenuOpen = true"
            >
                <Icon name="heroicons-outline:menu" size="28" />
            </button>
        </div>
    </nav>
  
    <div
        class="navigation__drawer"
        :class="{
            'navigation__drawer--open': isMenuOpen,
            'navigation__drawer--closed': !isMenuOpen,
        }"
    >
        <div
            :class="{
                'navigation__drawer-background--open': isMenuOpen,
            }"
            class="navigation__drawer-background"
            @click.self="isMenuOpen = false"
        ></div>
        
        <div
            :class="{
                'navigation__drawer-container--open': isMenuOpen,
            }"    
            class="navigation__drawer-container"
        >
            <button class="self-end" @click="isMenuOpen = false">
                <Icon name="heroicons-outline:x" size="28" />
            </button>

            <nav class="navigation">
                <div class="navigation__container-left">
                    <img
                        v-if="logo"
                        :src="logo"
                        class="navigation__logo"
                    />

                    <NuxtLink
                        :to="localePath('/')"
                        class="navigation__brand"
                    >
                        {{ $t('brand') }}
                    </NuxtLink>
                </div>
                <div class="navigation__container-right">
                    <button
                        class="navigation__drawer-toggle"
                        @click="isMenuOpen = false"
                    >
                        <Icon name="heroicons-outline:x" size="28" />
                    </button>
                </div>
            </nav>
            <Account
                v-if="isAccountDisplayed"
                class="navigation__account--mobile"
            />
            <div
                v-for="item in menu || []"
                :key="item.href"
                class="navigation__link-group"
            >
                <NuxtLink
                    :to="localePath(item.href)"
                    class="navigation__link"
                    activeClass="navigation__link--active"
                >
                    {{ $t(item.label) }}
                </NuxtLink>
                <NuxtLink
                    v-for="subItem in item.submenu || []"
                    :key="subItem.href"
                    :to="localePath(subItem.href)"
                    class="navigation__link navigation__link--sub"
                    activeClass="navigation__link--active"
                >
                    {{ $t(subItem.label) }}
                </NuxtLink>
            </div>
            <Tools
                class="navigation__tools"
                :hideDeleteButton="true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ClientOnly } from '#components';
import { ref } from 'vue';
import { useEnvironmentStore } from '@surf/nuxt-base/stores/environment';

const isMenuOpen = ref(false);
const { logo: maybeLogo, appName, menu, isAccountDisplayed } = useAppConfig();
const localePath = useLocalePath();

const environmentStore = useEnvironmentStore();

onMounted(async () => {
  if (!environmentStore.variables.length) {
    await environmentStore.fetchVariables();
  }
});

const imageBaseUrl = computed(() => {
  return environmentStore.variables.find(v => v.key === 'imageBaseUrl')?.value || '';
});

const logo = computed(() =>
    maybeLogo || appName.includes('registration') || appName.includes('exam')
        ? maybeLogo
        : `${imageBaseUrl.value}/images/${appName.split('-')[0]}/logos/logo.png`
);
</script>

<style lang="css" scoped>
.navigation {
    @apply
        px-4
        py-2
        fixed
        top-0
        left-0
        w-full
        bg-white
        text-black
        flex
        items-center
        justify-between
        shadow-md
        lg:px-8
    ;
}

.navigation__container-left {
    @apply
        flex
        items-center
        gap-0
    ;
}

.navigation__container-center {
    @apply
        hidden
        md:flex
        items-center
        max-md:hidden
        flex-grow
        gap-4
        lg:gap-6
        text-base
        mx-8
        lg:mx-12
        md:h-12
    ;
}

.navigation__logo {
    @apply
        w-auto
        h-14
        flex-shrink
        me-3
    ;
}

.navigation__brand-html {
    @apply
        hidden
        md:block
        text-primary
        text-lg
        font-semibold
        no-underline
        leading-tight;
    ;
}

.navigation__brand {
    @apply
        text-primary
        text-lg
        font-semibold
        md:hidden
        no-underline
    ;
}

.navigation__link {
    @apply
        hover:underline
        opacity-75
    ;
}

.navigation__drawer .navigation__link {
    @apply
        opacity-50
    ;
}

.navigation__link--active {
    @apply
        opacity-100
    ;
}

.navigation__link--sub {
    @apply
        ps-4
    ;
}

.navigation__link-group {
    @apply
        flex
        flex-col
        gap-4
    ;
}
.navigation__link-group:first-of-type {
    @apply
        mt-5
    ;
}

.navigation__account {
    @apply
        hidden
        md:flex
}

.navigation__account--mobile {
    @apply
        w-full
        flex
        justify-end
        my-2
    ;
}

.navigation__drawer-toggle {
    @apply
        md:hidden
        mt-2
        me-1
    ;
}

.navigation__drawer {
    @apply
        fixed
        w-full
        h-full
        top-0
        right-0
        z-50
        md:hidden
        translate-x-full
        transition-transform
    ;
}

.navigation__drawer--open {
    @apply
        translate-x-0
        delay-500
    ;
}

.navigation__drawer--open {
    @apply
        delay-0
    ;
}

.navigation__drawer-background {
    @apply
        fixed
        w-full
        h-full
        bg-black
        bg-opacity-85
        opacity-0
        transition-opacity
        duration-500
    ;
}

.navigation__drawer-background--open {
    @apply
        opacity-100
    ;
}

.navigation__drawer-container {
    @apply
        fixed
        right-0
        top-0
        h-full
        w-10/12
        bg-primary-100
        shadow-lg
        p-6
        flex
        flex-col
        gap-4
        translate-x-full
        transition-transform
        duration-500
    ;
}

.navigation__drawer-container--open {
    @apply
        fixed
        right-0
        top-0
        h-full
        bg-primary-100
        shadow-lg
        p-6
        flex
        flex-col
        gap-4
        translate-x-0
    ;
}

.navigation__tools {
    @apply
        fixed
        bottom-0
        right-0
        justify-end
    ;
}

.navigation__link.router-link-exact-active {
    @apply
        opacity-100
    ;
}
</style>