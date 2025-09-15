<template>
  <div class="home">
    <section class="hero">
      <h2>منصة أوفلاين تساعد المعلم على إنشاء اختبارات تفاعلية للطلاب</h2>
      <p>حفظ البيانات محليًا باستخدام LocalStorage</p>
    </section>

    <section class="how-to-use">
      <h3>كيفية الاستخدام</h3>
      <ol>
        <li>إنشاء اختبار جديد في صفحة الإنشاء</li>
        <li>إضافة الأسئلة والإجابات</li>
        <li>حفظ الاختبار</li>
        <li>بدء الاختبار من صفحة الاختبارات</li>
      </ol>
    </section>

    <div class="actions">
      <router-link to="/create" class="btn btn-primary">سجل اختبار جديد</router-link>
    </div>
  </div>
</template>

<script setup>
// Home component logic
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
}

.hero h2 {
  color: var(--color-primary);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.how-to-use {
  text-align: right;
  background: var(--color-gray-light);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.how-to-use ol {
  list-style-position: inside;
  margin-top: 1rem;
}

.how-to-use li {
  margin: 0.5rem 0;
}

.actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background-color: var(--color-primary-light);
}
</style>