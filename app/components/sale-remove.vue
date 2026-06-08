<template>
  <UModal v-model:open="open" :title="$t('sale_remove.title')">
    <UButton
      :disabled="props.total <= 0 || props.isPaid"
      :loading
      :label="$t('sale_remove.label')"
      color="error"
      class="w-full h-16 inline-block text-2xl shadow"
    ></UButton>

    <template #body>
      {{ $t('sale_remove.confirmation') }}
    </template>

    <template #footer="{ close }">
      <UButton
        :loading
        :label="$t('sale_remove.label')"
        color="error"
        @click="remove"
      ></UButton>

      <UButton
        :label="$t('cancel')"
        color="neutral"
        variant="subtle"
        @click="close"
      ></UButton>
    </template>
  </UModal>
</template>

<script setup>
  const props = defineProps({
    total: {
      type: [Number, String],
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['removed']);
  const sale = defineModel();
  const { removeItem } = useSales();
  const toast = useToast();
  const trans = useTranslation();
  const open = ref(false);
  const loading = ref(false);

  const remove = async () => {
    if (!sale.value?.id) return;
    loading.value = true;
    await removeItem(sale.value.id);
    emit('removed');
    loading.value = false;
    open.value = false;
    toast.add({
      title: trans('sale_remove.done'),
      icon: 'tabler:shopping-cart-cancel',
    });
  };
</script>
