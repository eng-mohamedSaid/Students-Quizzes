<template>
  <div class="flipping-card" :class="{ 'is-flipped': isFlipped }">
    <div class="flipping-card-inner">
      <div class="flipping-card-front" @click="flip">
        <slot name="front"></slot>
      </div>
      <div class="flipping-card-back">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isFlipped = ref(false);

const flip = () => {
  isFlipped.value = !isFlipped.value;
};

defineExpose({ flip, isFlipped });
</script>

<style scoped>
.flipping-card {
  perspective: 1000px;
  width: 100%;
  height: 100%;
}

.flipping-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flipping-card.is-flipped .flipping-card-inner {
  transform: rotateY(180deg);
}

.flipping-card-front,
.flipping-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--color-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flipping-card-front {
  cursor: pointer;
}

.flipping-card-back {
  transform: rotateY(180deg);
}
</style>