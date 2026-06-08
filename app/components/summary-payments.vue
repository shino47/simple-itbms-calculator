<template>
  <div class="bg-white shadow rounded overflow-hidden h-full">
    <div class="h-full flex flex-col justify-between">
      <div ref="boxRef" class="flex-1 overflow-y-auto">
        <div v-if="props.payments.length" class="p-3 space-y-2">
          <div v-for="(payment, idx) in props.payments" :key="idx" class="flex justify-between gap-4">
            <div>{{ $t(`payment_methods.${payment.type}`) }}</div>
            <div>{{ payment.value }}</div>
          </div>
        </div>

        <div v-else class="flex items-center justify-center h-full text-neutral-400 text-3xl">
          <UIcon name="tabler:cash-register"></UIcon>
        </div>
      </div>

      <div>
        <USeparator></USeparator>

        <div class="p-3 bg-neutral-50">
          <div class="space-y-2">
            <div class="flex justify-between gap-4">
              <div>{{ $t('paid') }}</div>
              <div :class="['font-semibold', { 'text-cyan-500': props.paymentsTotal > 0 }]">
                {{ props.paymentsTotal }}
              </div>
            </div>
            <div v-if="props.change > 0" class="flex justify-between gap-4">
              <div>{{ $t('change') }}</div>
              <div class="font-semibold text-rose-500">{{ props.change }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    payments: {
      type: Array,
      required: true,
    },
    paymentsTotal: {
      type: [Number, String],
      required: true,
    },
    change: {
      type: [Number, String],
      required: true,
    },
  });

  const boxRef = ref();

  watch(() => props.payments, () => {
    nextTick(() => {
      boxRef.value.scrollTo({
        top: boxRef.value.scrollHeight,
        behavior: 'smooth',
      });
    });
  }, { deep: true });
</script>
