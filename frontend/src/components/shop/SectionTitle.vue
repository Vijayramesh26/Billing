<template>
  <div :class="['mb-16', centered ? 'text-center' : '']">
    <div v-if="centered" class="d-flex justify-center mb-4">
       <div class="decorative-line"></div>
    </div>
    <h2 class="section-title font-weight-bold mb-4 text-primary">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-body-1 text-medium-emphasis mx-auto font-weight-light" style="max-width: 600px">
      {{ subtitle }}
    </p>
    <div v-if="!centered" class="decorative-line mt-4"></div>
  </div>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    title: String,
    subtitle: String,
    centered: { type: Boolean, default: true }
  }
}
</script>

<style scoped>
.section-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  line-height: 1.2;
}

.decorative-line {
  width: 60px;
  height: 3px;
  background-color: var(--secondary-color);
  opacity: 0.7;
}
</style>
