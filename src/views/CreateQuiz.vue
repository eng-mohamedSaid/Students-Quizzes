<template>
  <div class="create-quiz">
    <h2>{{ isEditing ? 'تعديل الاختبار' : 'إنشاء اختبار جديد' }}</h2>

    <form @submit.prevent="handleSubmit" class="quiz-form">
      <!-- Quiz Details -->
      <div class="form-group">
        <label for="title">عنوان الاختبار</label>
        <input
          id="title"
          v-model="quiz.title"
          type="text"
          required
          class="form-control"
          :class="{ 'error': errors.includes('عنوان الاختبار مطلوب') }"
        />
      </div>

      <div class="form-group">
        <label for="description">وصف الاختبار</label>
        <textarea
          id="description"
          v-model="quiz.description"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <!-- Questions Section -->
      <div class="questions-section">
        <h3>الأسئلة</h3>
        
        <!-- Add New Question Form -->
        <div class="question-form">
          <div class="form-group">
            <label for="questionText">السؤال</label>
            <input
              id="questionText"
              v-model="currentQuestion.text"
              type="text"
              class="form-control"
            />
          </div>

          <div class="answers-grid">
            <div v-for="(answer, index) in currentQuestion.answers" :key="index" class="answer-item">
              <input
                :id="'answer' + index"
                v-model="currentQuestion.answers[index]"
                type="text"
                class="form-control"
                :placeholder="'إجابة ' + (index + 1)"
              />
              <input
                type="radio"
                :id="'correct' + index"
                :value="answer"
                v-model="currentQuestion.correctAnswer"
                name="correctAnswer"
              />
              <label :for="'correct' + index">الإجابة الصحيحة</label>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-secondary"
            @click="addQuestion"
            :disabled="!isQuestionValid"
          >
            إضافة السؤال
          </button>
        </div>

        <!-- Questions List -->
        <div v-if="quiz.questions.length > 0" class="questions-list">
          <div v-for="(question, index) in quiz.questions" :key="index" class="question-item">
            <div class="question-content">
              <h4>السؤال {{ index + 1 }}</h4>
              <p>{{ question.text }}</p>
              <ul>
                <li v-for="(answer, ansIndex) in question.answers" :key="ansIndex"
                    :class="{ 'correct': answer === question.correctAnswer }">
                  {{ answer }}
                </li>
              </ul>
            </div>
            <div class="question-actions">
              <button type="button" class="btn btn-danger" @click="removeQuestion(index)">حذف</button>
              <button type="button" class="btn btn-secondary" @click="editQuestion(index)">تعديل</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
          {{ isEditing ? 'حفظ التعديلات' : 'حفظ الاختبار' }}
        </button>
        <router-link to="/" class="btn btn-secondary">إلغاء</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { quizStorage } from '../utils/quizStorage';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const errors = ref([]);

const quiz = ref({
  title: '',
  description: '',
  questions: []
});

const currentQuestion = ref({
  text: '',
  answers: ['', '', '', ''],
  correctAnswer: ''
});

const isQuestionValid = computed(() => {
  return currentQuestion.value.text.trim() &&
         currentQuestion.value.answers.every(answer => answer.trim()) &&
         currentQuestion.value.correctAnswer;
});

const isFormValid = computed(() => {
  return quiz.value.title.trim() && quiz.value.questions.length > 0;
});

onMounted(() => {
  if (isEditing.value) {
    const existingQuiz = quizStorage.getQuiz(route.params.id);
    if (existingQuiz) {
      quiz.value = { ...existingQuiz };
    } else {
      router.push('/');
    }
  }
});

const addQuestion = () => {
  if (!isQuestionValid.value) return;
  
  quiz.value.questions.push({
    text: currentQuestion.value.text,
    answers: [...currentQuestion.value.answers],
    correctAnswer: currentQuestion.value.correctAnswer
  });

  // Reset the form
  currentQuestion.value = {
    text: '',
    answers: ['', '', '', ''],
    correctAnswer: ''
  };
};

const removeQuestion = (index) => {
  quiz.value.questions.splice(index, 1);
};

const editQuestion = (index) => {
  const question = quiz.value.questions[index];
  currentQuestion.value = {
    text: question.text,
    answers: [...question.answers],
    correctAnswer: question.correctAnswer
  };
  removeQuestion(index);
};

const handleSubmit = () => {
  errors.value = quizStorage.validateQuiz(quiz.value);
  if (errors.value.length > 0) return;

  try {
    quizStorage.saveQuiz(quiz.value);
    router.push('/quizzes');
  } catch (error) {
    errors.value = ['حدث خطأ أثناء حفظ الاختبار'];
  }
};
</script>

<style scoped>
.create-quiz {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.quiz-form {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: var(--font-primary);
}

.form-control.error {
  border-color: var(--color-error);
}

.answers-grid {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.answer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.questions-list {
  margin-top: 2rem;
}

.question-item {
  background-color: var(--color-gray-light);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.question-content ul {
  list-style: none;
  padding: 0;
}

.question-content li.correct {
  color: var(--color-success);
  font-weight: bold;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-primary);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-secondary {
  background-color: var(--color-gray-light);
  color: var(--color-primary);
}

.btn-danger {
  background-color: var(--color-error);
  color: var(--color-white);
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>