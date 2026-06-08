<template>
  <div class="bg-white shadow rounded overflow-hidden">
    <div class="p-3 space-y-2">
      <div class="flex justify-between gap-4">
        <div>{{ $t('exempt') }}</div>
        <div>{{ props.subtotalExempt }}</div>
      </div>
      <div class="flex justify-between gap-4">
        <div>{{ $t('taxed') }}</div>
        <div>{{ props.subtotalTaxed }}</div>
      </div>
    </div>

    <USeparator></USeparator>

    <div class="p-3 space-y-2">
      <div class="flex justify-between gap-4">
        <div>{{ $t('subtotal') }}</div>
        <div>{{ props.subtotal }}</div>
      </div>
      <div class="flex justify-between gap-4">
        <div>{{ $t('tax') }}</div>
        <div>{{ props.taxes }}</div>
      </div>
    </div>

    <USeparator></USeparator>

    <div class="p-3 bg-neutral-50">
      <div class="flex justify-between gap-4">
        <div>{{ $t('total') }}</div>
        <div class="font-semibold text-emerald-600">{{ props.total }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    subtotalExempt: {
      type: [Number, String],
      required: true,
    },
    subtotalTaxed: {
      type: [Number, String],
      required: true,
    },
    subtotal: {
      type: [Number, String],
      required: true,
    },
    taxes: {
      type: [Number, String],
      required: true,
    },
    total: {
      type: [Number, String],
      required: true,
    },
  });
</script>
