<template>
  <div class="bg-white rounded p-4 flex justify-between gap-6 cursor-pointer" @click="onShow">
    <div class="flex-1">
      <div class="font-semibold">#{{ props.sale.id }}</div>
      <div>
        <span class="font-semibold">{{ $t('total') }}:</span> {{ props.sale.total }}
      </div>
      <div v-if="statusDate">
        <span class="font-semibold">{{ $t('date') }}:</span> {{ statusDate }}
      </div>
    </div>

    <div>
      <SaleStatus :sale="props.sale"></SaleStatus>
    </div>
  </div>

  <UModal v-model:open="open" scrollable>
    <template #title>
      <span class="inline-block mr-4">#{{ props.sale.id }}</span>
      <SaleStatus :sale="props.sale"></SaleStatus>
    </template>

    <template #body>
      <div class="space-y-4">
        <div>
          <h4 class="mb-1 font-semibold">{{ $t('sale_item.articles') }}</h4>

          <div class="bg-white rounded p-4 flex flex-col gap-2">
            <div
              v-for="item in props.sale.articles"
              :key="item.id"
              class="flex justify-between gap-4"
            >
              <div class="space-x-2">
                <span>{{ item.qty }}</span>
                <span>&times;</span>
                <span>{{ item.price }}</span>
                <span v-if="item.tax > 0">({{ $t('taxed_initial') }})</span>
                <span v-else>({{ $t('exempt_initial') }})</span>
              </div>

              <div>{{ item.amount }}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="mb-1 font-semibold">{{ $t('sale_item.totals') }}</h4>

          <div class="bg-white rounded">
            <div class="p-4 space-y-2">
              <div class="flex justify-between">
                <div>{{ $t('exempt') }}</div>
                <div>{{ props.sale.subtotalExempt }}</div>
              </div>
              <div class="flex justify-between">
                <div>{{ $t('taxed') }}</div>
                <div>{{ props.sale.subtotalTaxed }}</div>
              </div>
            </div>

            <USeparator></USeparator>

            <div class="p-4 space-y-2">
              <div class="flex justify-between">
                <div>{{ $t('subtotal') }}</div>
                <div>{{ props.sale.subtotal }}</div>
              </div>
              <div class="flex justify-between">
                <div>{{ $t('tax') }}</div>
                <div>{{ props.sale.taxes }}</div>
              </div>
            </div>

            <USeparator></USeparator>

            <div class="p-4">
              <div class="flex justify-between">
                <div class="font-semibold">{{ $t('total') }}</div>
                <div class="font-semibold">{{ props.sale.total }}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="mb-1 font-semibold">{{ $t('sale_item.payments') }}</h4>

          <div class="bg-white rounded">
            <template v-if="props.sale.payments.length">
              <div class="p-4 space-y-2">
                <div
                  v-for="(payment, idx) in props.sale.payments"
                  :key="idx"
                  class="flex justify-between"
                >
                  <div>{{ $t(`payment_methods.${payment.type}`) }}</div>
                  <div>{{ payment.value }}</div>
                </div>
              </div>

              <USeparator></USeparator>

              <div class="p-4 space-y-2">
                <div class="flex justify-between">
                  <div class="font-semibold">{{ $t('total_paid') }}</div>
                  <div class="font-semibold">{{ props.sale.paymentsTotal }}</div>
                </div>
                <div v-if="props.sale.change > 0" class="flex justify-between">
                  <div>{{ $t('change') }}</div>
                  <div>{{ props.sale.change }}</div>
                </div>
              </div>
            </template>

            <div v-else class="p-4 text-neutral-400 text-center text-3xl">
              <UIcon name="tabler:cash-register"></UIcon>
            </div>
          </div>
        </div>

        <div v-if="statusDate">
          <span class="font-semibold">{{ $t('date') }}:</span> {{ statusDate }}
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        v-if="'suspended' == props.sale.status"
        :label="$t('sale_item.resume')"
        color="warning"
        @click="onSelected"
      ></UButton>

      <UButton
        :label="$t('close')"
        color="neutral"
        variant="subtle"
        @click="close"
      ></UButton>
    </template>
  </UModal>
</template>

<script setup>
  const props = defineProps({
    sale: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['selected']);
  const open = ref(false);
  const canOpen = computed(() => 'current' != props.sale.status);
  const statusDate = computed(() => {
    if (!props.sale.statusAt) return;
    return new Intl.DateTimeFormat('es-PA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(props.sale.statusAt));
  });

  const onShow = () => {
    if (canOpen.value) {
      open.value = true;
    } else {
      emit('selected', props.sale);
    }
  };

  const onSelected = () => {
    emit('selected', props.sale);
    open.value = false;
  };
</script>
