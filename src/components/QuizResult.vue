<template>
  <div class="quiz-result">
    <h2>نتيجة الاختبار</h2>
    
    <div class="result-summary">
      <div class="score">
        <div class="score-value">{{ percentage }}%</div>
        <div class="grade">{{ grade }}</div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="label">عدد الأسئلة:</span>
          <span class="value">{{ totalQuestions }}</span>
        </div>
        <div class="stat-item">
          <span class="label">الإجابات الصحيحة:</span>
          <span class="value correct">{{ correctAnswers }}</span>
        </div>
        <div class="stat-item">
          <span class="label">الإجابات الخاطئة:</span>
          <span class="value incorrect">{{ incorrectAnswers }}</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" @click="$emit('review')">مراجعة الإجابات</button>
      <button class="btn" @click="$emit('retry')">إعادة الاختبار</button>
      <router-link to="/" class="btn">العودة للصفحة الرئيسية</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  }
});

const incorrectAnswers = computed(() => 
  props.totalQuestions - props.correctAnswers
);

const percentage = computed(() => 
  Math.round((props.correctAnswers / props.totalQuestions) * 100)
);

const grade = computed(() => {
  const score = percentage.value;
  if (score >= 90) return 'ممتاز';
  if (score >= 80) return 'جيد جداً';
  if (score >= 70) return 'جيد';
  return 'مقبول';
});

defineEmits(['review', 'retry']);
</script>

<style scoped>
.quiz-result {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.result-summary {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.score {
  text-align: center;
}

.score-value {
  font-size: 4rem;
  font-weight: bold;
  color: var(--color-primary);
}

.grade {
  font-size: 1.5rem;
  color: var(--color-primary-light);
  margin-top: 0.5rem;
}

.stats {
  display: grid;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: var(--color-gray-light);
  border-radius: 4px;
}

.correct {
  color: var(--color-success);
}

.incorrect {
  color: var(--color-error);
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-primary);
  color: var(--color-white);
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-primary);
}

.btn:hover {
  background-color: var(--color-primary-light);
}
</style>