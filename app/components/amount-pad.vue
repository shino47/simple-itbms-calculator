<template>
  <div class="bg-white rounded shadow relative overflow-hidden">
    <div v-if="props.isPaid" class="absolute inset-0 bg-white/50 backdrop-blur z-10">
      <div class="w-full h-full flex justify-center items-center">
        <UButton
          icon="tabler:plus"
          :label="$t('new_sale')"
          class="p-4 text-2xl"
          @click="reset"
        ></UButton>
      </div>
    </div>

    <div class="py-4 space-y-4">
      <div class="grid grid-cols-3 gap-4 px-4">
        <UButton
          :disabled="multiplier <= 0 || amount <= 0"
          color="warning"
          variant="subtle"
          class="w-full h-16 inline-block text-2xl"
          @click="addExempt"
        >
          {{ $t('btn_exempt') }}
        </UButton>

        <UButton
          :disabled="multiplier <= 0 || amount <= 0"
          color="info"
          variant="subtle"
          class="w-full h-16 inline-block text-2xl"
          @click="addTaxed"
        >
          {{ $t('btn_add_itbms') }}
        </UButton>

        <UButton
          :disabled="multiplier <= 0 || amount <= 0"
          color="info"
          class="w-full h-16 inline-block text-2xl"
          @click="addWithTaxIncluded"
        >
          {{ $t('btn_itbms_included') }}
        </UButton>
      </div>

      <div class="flex justify-between items-center gap-6 p-4 my-4 border-y border-neutral-200">
        <div>
          <UButton
            size="sm"
            variant="outline"
            color="error"
            @click="clear"
          >
            {{ $t('clear') }}
          </UButton>
        </div>

        <div class="font-bold text-4xl">
          <template v-if="multiplierPressed">
            <span class="text-neutral-400">{{ multiplier }}</span>

            <span class="text-neutral-400 mx-2">&times;</span>
          </template>

          <span>{{ amount }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 px-4">
        <UButton
          v-for="button in buttons"
          :key="button"
          size="xl"
          variant="subtle"
          color="neutral"
          class="w-full h-16 inline-block text-2xl"
          @click="setValue(button)"
        >
          {{ button }}
        </UButton>

        <UButton
          :disabled="multiplierPressed || amount <= 0"
          size="xl"
          variant="subtle"
          color="neutral"
          class="w-full h-16 inline-block text-4xl"
          @click="setMultiplier"
        >
          &times;
        </UButton>

        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Big from 'big.js';

  const props = defineProps({
    isPaid: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['added', 'reset']);
  const amount = ref('0.00');
  const multiplier = ref(1);
  const multiplierPressed = ref(false);
  const dotPressed = ref(false);

  const buttons = [
    7, 8, 9,
    4, 5, 6,
    1, 2, 3,
    '00', 0, '.',
  ];

  const setValue = (button) => {
    if ('.' == button) {
      dotPressed.value = true;
      amount.value = getValueFromNumpadDot(amount.value);
    } else {
      amount.value = getValueFromNumpadNumber(amount.value, button);
    }
  };

  const setMultiplier = () => {
    multiplierPressed.value = true;
    multiplier.value = !dotPressed.value && amount.value < 1
      ? parseInt(amount.value * 100)
      : amount.value;
    amount.value = '0.00';
  };

  const clear = () => {
    dotPressed.value = false;
    multiplierPressed.value = false;
    multiplier.value = 1;
    amount.value = '0.00';
  };

  const reset = () => {
    clear();
    emit('reset');
  };

  const addExempt = () => {
    const qty = Big(multiplier.value);
    const price = Big(amount.value);
    emit('added', {
      id: generateId(),
      qty: qty.toString(),
      price: price.toFixed(2),
      amount: price.times(qty).toFixed(2),
      tax: '0.00',
    });
    clear();
  };

  const addTaxed = () => {
    const qty = Big(multiplier.value);
    const price = Big(amount.value);
    const tax = price.times(qty).times(0.07);
    emit('added', {
      id: generateId(),
      qty: qty.toString(),
      price: price.toFixed(2),
      amount: price.times(qty).toFixed(2),
      tax: tax.toFixed(2),
    });
    clear();
  };

  const addWithTaxIncluded = () => {
    const qty = Big(multiplier.value);
    const priceTaxed = Big(amount.value);
    const price = priceTaxed.div(1.07);
    emit('added', {
      id: generateId(),
      qty: qty.toString(),
      price: price.toFixed(2),
      amount: price.times(qty).toFixed(2),
      tax: priceTaxed.minus(price).toFixed(2),
    });
    clear();
  };
</script>
