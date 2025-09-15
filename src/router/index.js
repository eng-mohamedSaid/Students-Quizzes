import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/create',
    name: 'CreateQuiz',
    component: () => import('../views/CreateQuiz.vue')
  },
  {
    path: '/quizzes',
    name: 'QuizList',
    component: () => import('../views/QuizList.vue')
  },
  {
    path: '/quiz/:id',
    name: 'StartQuiz',
    component: () => import('../views/StartQuiz.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router