import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import router from './router'

// Add route transition guard
router.beforeEach((to, from, next) => {
  // Add route transition class
  document.body.classList.add('page-transition')
  next()
})

router.afterEach(() => {
  // Remove route transition class
  setTimeout(() => {
    document.body.classList.remove('page-transition')
  }, 300)
})

const app = createApp(App)
app.use(router)
app.mount('#app')
