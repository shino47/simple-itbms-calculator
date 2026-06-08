<template>
  <USlideover v-model:open="open" :ui="{ footer: 'sm:px-0' }" @after:enter="onOpen">
    <UButton
      :disabled="props.total <= 0 || props.isPaid"
      :label="$t('pay')"
      color="success"
      class="col-span-2 w-full h-16 inline-block text-2xl"
    ></UButton>

    <template #title>
      <span>{{ $t('total_to_pay') }}:</span>
      <span class="ml-1 text-cyan-500">{{ props.total }}</span>
    </template>

    <template #body>
      <div ref="boxRef">
        <Transition name="fade" mode="out-in">
          <div v-if="!payments.length" class="flex items-center justify-center h-full text-neutral-400 text-3xl">
            <UIcon name="tabler:cash-register"></UIcon>
          </div>

          <div v-else class="flex flex-col gap-3 relative">
            <TransitionGroup name="slideY">
              <div v-for="payment in payments" :key="payment.id" class="space-y-4">
                <div class="flex justify-between items-center gap-4">
                  <UButton
                    :disabled="props.isPaid"
                    color="error"
                    icon="tabler:trash"
                    variant="outline"
                    @click="removePayment(payment)"
                  ></UButton>

                  <div class="flex flex-1 justify-between gap-4">
                    <div>{{ $t(`payment_methods.${payment.type}`) }}</div>

                    <span class="font-semibold">{{ payment.value }}</span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
      </div>
    </template>

    <template #footer>
      <div class="w-full space-y-4">
        <div class="px-6 space-y-2">
          <div class="flex justify-between">
            <div>{{ $t('paid') }}</div>
            <div :class="['font-semibold', { 'text-cyan-500': props.paymentsTotal > 0 }]">
              {{ props.paymentsTotal }}
            </div>
          </div>
          <div class="flex justify-between">
            <div>{{ $t('change') }}</div>
            <div :class="['font-semibold', { 'text-rose-500': props.change > 0 }]">
              {{ props.change }}
            </div>
          </div>
        </div>

        <USeparator></USeparator>

        <div class="grid grid-cols-2 gap-4 px-6">
          <UButton
            :disabled="amount <= 0 || props.isPaid"
            :label="$t('payment_methods.cash')"
            size="xl"
            variant="subtle"
            color="success"
            class="h-12 w-full inline-block text-xl"
            @click="addPayment('cash')"
          ></UButton>

          <UButton
            :disabled="amount <= 0 || props.isPaid"
            :label="$t('payment_methods.yappy')"
            size="xl"
            variant="subtle"
            color="primary"
            class="h-12 w-full inline-block text-xl"
            @click="addPayment('yappy')"
          ></UButton>

          <UButton
            :disabled="amount <= 0 || props.isPaid"
            :label="$t('payment_methods.debit_card')"
            size="xl"
            variant="subtle"
            color="warning"
            class="h-12 w-full inline-block text-xl"
            @click="addPayment('debit_card')"
          ></UButton>

          <UButton
            :disabled="amount <= 0 || props.isPaid"
            :label="$t('payment_methods.credit_card')"
            size="xl"
            variant="subtle"
            color="secondary"
            class="h-12 w-full inline-block text-xl"
            @click="addPayment('credit_card')"
          ></UButton>
        </div>

        <USeparator></USeparator>

        <div class="flex justify-between items-center gap-6 px-6">
          <div>
            <UButton
              :disabled="props.isPaid"
              size="sm"
              variant="outline"
              color="error"
              @click="amount = '0.00'"
            >
              {{ $t('clear') }}
            </UButton>
          </div>

          <div class="font-bold text-3xl">
            <span>{{ amount }}</span>
          </div>
        </div>

        <USeparator></USeparator>

        <div class="grid grid-cols-3 gap-4 px-6">
          <UButton
            v-for="button in buttons"
            :key="button"
            :disabled="props.isPaid"
            size="xl"
            variant="subtle"
            color="neutral"
            class="h-12 w-full inline-block text-xl"
            @click="setValue(button)"
          >
            {{ button }}
          </UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
  import Big from 'big.js';

  const props = defineProps({
    total: {
      type: [Number, String],
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
    isPaid: {
      type: Boolean,
      required: true,
    },
  });

  const payments = defineModel();
  const open = ref(false);
  const amount = ref('0.00');
  const boxRef = ref();

  const buttons = [
    7, 8, 9,
    4, 5, 6,
    1, 2, 3,
    '00', 0, '.',
  ];

  const setValue = (button) => {
    if (props.total == amount.value) {
      amount.value = '0.00';
    }
    amount.value = '.' == button
      ? getValueFromNumpadDot(amount.value)
      : getValueFromNumpadNumber(amount.value, button);
  };

  const addPayment = (type) => {
    payments.value.push({
      id: generateId(),
      type,
      value: Big(amount.value).toFixed(2),
    });
    amount.value = '0.00';
    nextTick(() => {
      boxRef.value?.parentElement?.scrollTo({
        top: boxRef.value?.parentElement?.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  const removePayment = (payment) => {
    payments.value = payments.value.filter(elem => elem.id != payment.id);
  };

  const onOpen = () => {
    amount.value = Big(props.total).minus(props.paymentsTotal).toFixed(2);
  };

  watch(() => props.isPaid, () => {
    if (props.isPaid) {
      open.value = false;
    }
  });
</script>
