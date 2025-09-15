<template>
  <div class="spinner-container">
    <div class="spinner" :style="{ transform: `rotate(${rotation}deg)` }">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="spinner-item"
        :style="getItemStyle(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <button class="spinner-button" @click="spin" :disabled="isSpinning">
      {{ isSpinning ? 'جاري الدوران...' : 'دوّر العجلة' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select']);

const rotation = ref(0);
const isSpinning = ref(false);

const getItemStyle = (index) => {
  const angle = (360 / props.items.length) * index;
  return {
    transform: `rotate(${angle}deg) translateY(-150px) rotate(-${angle}deg)`,
  };
};

const spin = () => {
  if (isSpinning.value) return;
  
  isSpinning.value = true;
  const randomSpins = 5 + Math.random() * 5; // 5-10 full rotations
  const randomAngle = Math.random() * 360;
  const totalRotation = (randomSpins * 360) + randomAngle;
  
  rotation.value = 0;
  requestAnimationFrame(() => {
    rotation.value = totalRotation;
  });

  setTimeout(() => {
    isSpinning.value = false;
    const selectedIndex = Math.floor(
      ((360 - (totalRotation % 360)) / 360) * props.items.length
    );
    emit('select', props.items[selectedIndex]);
  }, 5000);
};
</script>

<style scoped>
.spinner-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.spinner-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  background-color: var(--color-primary-light);
  color: var(--color-white);
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  min-width: 120px;
}

.spinner-button {
  position: relative;
  z-index: 1;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  cursor: pointer;
  font-family: var(--font-primary);
  font-weight: bold;
  transition: background-color 0.3s;
}

.spinner-button:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

.spinner-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>