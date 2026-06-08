<template>
  <UBadge variant="soft" :color>
    {{ $t(`sale_status.${props.sale.status}`) }}
  </UBadge>
</template>

<script setup>
  const props = defineProps({
    sale: {
      type: Object,
      required: true,
    },
  });

  const colors = {
    current: 'primary',
    suspended: 'warning',
    finished: 'success',
  };

  const color = computed(() => colors[props.sale.status] || colors.current);
</script>
