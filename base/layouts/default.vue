<template>
  <main class="main">
    <UContainer class="container">
      <slot />
    </UContainer>
  </main>
  <Navigation />
  <Footer class="footer"/>
</template>
    
<style scoped lang="css">
.main {
  @apply pt-16 pb-16;
}

.container {
  @apply mt-4;
}

.footer {
  @apply
    hidden
    md:block
  ;
}
</style>
  