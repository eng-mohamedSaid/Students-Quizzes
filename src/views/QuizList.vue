<template>
  <div class="quiz-list">
    <div class="header">
      <h2>قائمة الاختبارات</h2>
      <router-link to="/create" class="btn btn-primary">سجل اختبار جديد</router-link>
    </div>

    <div v-if="quizzes.length === 0" class="empty-state">
      <p>لا توجد اختبارات حالياً</p>
      <p>أنشئ اختبارك الأول عن طريق الضغط على زر "سجل اختبار جديد"</p>
    </div>

    <div v-else class="quiz-grid">
      <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-card">
        <div class="quiz-card-content">
          <h3>{{ quiz.title }}</h3>
          <p v-if="quiz.description">{{ quiz.description }}</p>
          <div class="quiz-stats">
            <span>عدد الأسئلة: {{ quiz.questions.length }}</span>
          </div>
        </div>
        <div class="quiz-card-actions">
          <router-link :to="'/quiz/' + quiz.id" class="btn btn-primary">بدء الاختبار</router-link>
          <router-link :to="'/create/' + quiz.id" class="btn btn-secondary">تعديل الاختبار</router-link>
          <button @click="confirmDelete(quiz)" class="btn btn-danger">حذف</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>تأكيد الحذف</h3>
        <p>هل أنت متأكد من حذف اختبار "{{ quizToDelete?.title }}"؟</p>
        <div class="modal-actions">
          <button @click="deleteQuiz" class="btn btn-danger">نعم، احذف</button>
          <button @click="showDeleteModal = false" class="btn btn-secondary">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { quizStorage } from '../utils/quizStorage';

const quizzes = ref([]);
const showDeleteModal = ref(false);
const quizToDelete = ref(null);

const loadQuizzes = () => {
  quizzes.value = quizStorage.getQuizzes();
};

const confirmDelete = (quiz) => {
  quizToDelete.value = quiz;
  showDeleteModal.value = true;
};

const deleteQuiz = () => {
  if (quizToDelete.value) {
    quizStorage.deleteQuiz(quizToDelete.value.id);
    loadQuizzes();
    showDeleteModal.value = false;
    quizToDelete.value = null;
  }
};

onMounted(loadQuizzes);
</script>

<style scoped>
.quiz-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-gray-light);
  border-radius: 8px;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.quiz-card {
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quiz-card-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.quiz-card h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.quiz-stats {
  margin-top: 1rem;
  color: var(--color-primary-light);
}

.quiz-card-actions {
  padding: 1rem;
  background-color: var(--color-gray-light);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-primary);
  text-align: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-primary);
}

.btn-danger {
  background-color: var(--color-error);
  color: var(--color-white);
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .quiz-card-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>