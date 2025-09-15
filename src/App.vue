<script setup>
// App root component
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>اختبر تلاميذك</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Import Arabic font */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

:root {
  /* Colors as per requirements */
  --color-primary: #1E3A8A;
  --color-primary-light: #3B82F6;
  --color-white: #FFFFFF;
  --color-gray-light: #F3F4F6;
  --color-success: #10B981;
  --color-error: #EF4444;
  
  /* Font families */
  --font-primary: 'Cairo', sans-serif;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
