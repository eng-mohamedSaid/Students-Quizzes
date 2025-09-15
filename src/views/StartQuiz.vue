<template>
  <div class="start-quiz">
    <template v-if="!quizStarted">
      <div class="quiz-intro">
        <h2>{{ quiz?.title }}</h2>
        <p v-if="quiz?.description">{{ quiz.description }}</p>
        <div class="mode-selection">
          <h3>اختر نمط الاختبار</h3>
          <div class="mode-options">
            <button
              v-for="mode in quizModes"
              :key="mode.id"
              class="mode-button"
              :class="{ 'selected': selectedMode === mode.id }"
              @click="selectedMode = mode.id"
            >
              <h4>{{ mode.name }}</h4>
              <p>{{ mode.description }}</p>
            </button>
          </div>
        </div>
        <button @click="startQuiz" class="btn btn-primary">ابدأ الاختبار</button>
      </div>
    </template>

    <template v-else>
      <!-- Standard Mode -->
      <div v-if="selectedMode === 'standard'" class="quiz-mode standard">
        <div class="quiz-header">
          <div class="progress">السؤال {{ currentQuestionIndex + 1 }} من {{ quiz.questions.length }}</div>
          <div class="timer" v-if="timeLeft > 0">{{ timeLeft }} ثانية</div>
        </div>

        <div class="question-container">
          <h3>{{ currentQuestion.text }}</h3>
          <div class="answers">
            <button
              v-for="answer in currentQuestion.answers"
              :key="answer"
              class="answer-button"
              :class="getAnswerClass(answer)"
              @click="selectAnswer(answer)"
              :disabled="answerSelected"
            >
              {{ answer }}
            </button>
          </div>
        </div>

        <div class="navigation-buttons">
          <button
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="btn btn-secondary"
          >
            السؤال السابق
          </button>
          <button
            v-if="currentQuestionIndex < quiz.questions.length - 1"
            @click="nextQuestion"
            class="btn btn-primary"
            :disabled="!answerSelected"
          >
            السؤال التالي
          </button>
          <button
            v-else
            @click="finishQuiz"
            class="btn btn-primary"
            :disabled="!answerSelected"
          >
            إنهاء الاختبار
          </button>
        </div>
      </div>

      <!-- Spinner Mode -->
      <div v-else-if="selectedMode === 'spinner'" class="quiz-mode spinner">
        <Spinner
          :items="spinnerQuestions"
          @select="handleSpinnerSelection"
        />
        
        <div v-if="currentSpinnerQuestion" class="question-container">
          <h3>{{ currentSpinnerQuestion.text }}</h3>
          <div class="answers">
            <button
              v-for="answer in currentSpinnerQuestion.answers"
              :key="answer"
              class="answer-button"
              :class="getAnswerClass(answer)"
              @click="selectAnswer(answer)"
              :disabled="answerSelected"
            >
              {{ answer }}
            </button>
          </div>
        </div>
      </div>

      <!-- Flipping Cards Mode -->
      <div v-else class="quiz-mode cards">
        <div class="cards-grid">
          <FlippingCard
            v-for="(question, index) in quiz.questions"
            :key="index"
            ref="cardRefs"
            :style="getCardStyle(index)"
          >
            <template #front>
              <div class="card-front">
                <span class="card-number">{{ index + 1 }}</span>
                <h3>{{ question.text }}</h3>
              </div>
            </template>
            <template #back>
              <div class="card-back">
                <div class="answers">
                  <button
                    v-for="answer in question.answers"
                    :key="answer"
                    class="answer-button"
                    :class="getAnswerClass(answer, index)"
                    @click="selectAnswerForCard(answer, index)"
                    :disabled="cardAnswers[index] !== undefined"
                  >
                    {{ answer }}
                  </button>
                </div>
              </div>
            </template>
          </FlippingCard>
        </div>
        
        <button
          v-if="Object.keys(cardAnswers).length === quiz.questions.length"
          @click="finishQuiz"
          class="btn btn-primary"
        >
          إنهاء الاختبار
        </button>
      </div>
    </template>

    <!-- Quiz Results -->
    <QuizResult
      v-if="showResults"
      :totalQuestions="quiz.questions.length"
      :correctAnswers="correctAnswersCount"
      @review="showReview = true"
      @retry="resetQuiz"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { quizStorage } from '../utils/quizStorage';
import Spinner from '../components/Spinner.vue';
import FlippingCard from '../components/FlippingCard.vue';
import QuizResult from '../components/QuizResult.vue';

const route = useRoute();
const router = useRouter();

const quiz = ref(null);
const quizStarted = ref(false);
const showResults = ref(false);
const showReview = ref(false);
const selectedMode = ref('standard');
const currentQuestionIndex = ref(0);
const answerSelected = ref(false);
const timeLeft = ref(60);
const timerInterval = ref(null);
const currentSpinnerQuestion = ref(null);
const cardAnswers = ref({});
const cardRefs = ref([]);

const quizModes = [
  {
    id: 'standard',
    name: 'الوضع القياسي',
    description: 'عرض الأسئلة واحداً تلو الآخر مع مؤقت لكل سؤال'
  },
  {
    id: 'spinner',
    name: 'العجلة الدوارة',
    description: 'اختيار الأسئلة عشوائياً باستخدام العجلة الدوارة'
  },
  {
    id: 'cards',
    name: 'البطاقات',
    description: 'عرض الأسئلة كبطاقات تفاعلية يمكن قلبها'
  }
];

const currentQuestion = computed(() => {
  if (!quiz.value || !quiz.value.questions.length) return null;
  return quiz.value.questions[currentQuestionIndex.value];
});

const spinnerQuestions = computed(() => {
  if (!quiz.value) return [];
  return quiz.value.questions.map((q, index) => ({
    text: `السؤال ${index + 1}`,
    originalIndex: index
  }));
});

const correctAnswersCount = computed(() => {
  if (selectedMode.value === 'cards') {
    return Object.entries(cardAnswers.value).filter(([index, answer]) => 
      answer === quiz.value.questions[index].correctAnswer
    ).length;
  }
  // Implementation for other modes...
  return 0;
});

onMounted(() => {
  const loadedQuiz = quizStorage.getQuiz(route.params.id);
  if (!loadedQuiz) {
    router.push('/quizzes');
    return;
  }
  quiz.value = loadedQuiz;
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

const startQuiz = () => {
  quizStarted.value = true;
  if (selectedMode.value === 'standard') {
    startTimer();
  }
};

const startTimer = () => {
  timeLeft.value = 60;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      nextQuestion();
    }
  }, 1000);
};

const selectAnswer = (answer) => {
  answerSelected.value = true;
  if (selectedMode.value === 'standard') {
    clearInterval(timerInterval.value);
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++;
    answerSelected.value = false;
    if (selectedMode.value === 'standard') {
      startTimer();
    }
  } else {
    finishQuiz();
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    answerSelected.value = false;
    if (selectedMode.value === 'standard') {
      startTimer();
    }
  }
};

const handleSpinnerSelection = (item) => {
  currentSpinnerQuestion.value = quiz.value.questions[item.originalIndex];
};

const selectAnswerForCard = (answer, index) => {
  cardAnswers.value[index] = answer;
};

const getAnswerClass = (answer, questionIndex = null) => {
  if (!answerSelected.value && questionIndex === null) return '';
  
  const question = questionIndex !== null 
    ? quiz.value.questions[questionIndex]
    : currentQuestion.value;
    
  if (
    (questionIndex !== null && cardAnswers.value[questionIndex]) ||
    answerSelected.value
  ) {
    if (answer === question.correctAnswer) {
      return 'correct';
    }
    if (
      (questionIndex !== null && cardAnswers.value[questionIndex] === answer) ||
      selectedAnswer === answer
    ) {
      return 'incorrect';
    }
  }
  return '';
};

const getCardStyle = (index) => {
  const columns = Math.min(3, Math.ceil(Math.sqrt(quiz.value.questions.length)));
  return {
    width: `calc(${100 / columns}% - 2rem)`,
    margin: '1rem'
  };
};

const finishQuiz = () => {
  showResults.value = true;
};

const resetQuiz = () => {
  quizStarted.value = false;
  showResults.value = false;
  showReview.value = false;
  currentQuestionIndex.value = 0;
  answerSelected.value = false;
  currentSpinnerQuestion.value = null;
  cardAnswers.value = {};
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
};
</script>

<style scoped>
.start-quiz {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.quiz-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.mode-selection {
  margin: 2rem 0;
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.mode-button {
  padding: 1.5rem;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-button.selected {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.timer {
  font-size: 1.25rem;
  color: var(--color-primary);
}

.question-container {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.answers {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.answer-button {
  padding: 1rem;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
  text-align: right;
}

.answer-button:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  color: var(--color-white);
}

.answer-button.correct {
  background-color: var(--color-success);
  color: var(--color-white);
  border-color: var(--color-success);
}

.answer-button.incorrect {
  background-color: var(--color-error);
  color: var(--color-white);
  border-color: var(--color-error);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.card-front,
.card-back {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--color-primary);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-primary);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-secondary {
  background-color: var(--color-gray-light);
  color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .mode-options {
    grid-template-columns: 1fr;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }
}
</style>