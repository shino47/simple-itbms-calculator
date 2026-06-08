<template>
  <UError :error="props.error"></UError>
</template>

<script setup>
  const props = defineProps({
    error: {
      type: Object,
      required: true,
    },
  });
</script>
