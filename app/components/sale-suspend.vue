<template>
  <UModal v-model:open="open" :title="$t('sale_suspend.title')">
    <UButton
      :disabled="props.total <= 0 || props.isPaid"
      :loading
      :label="$t('sale_suspend.label')"
      color="warning"
      class="w-full h-16 inline-block text-2xl shadow"
    ></UButton>

    <template #body>
      {{ $t('sale_suspend.confirmation') }}
    </template>

    <template #footer="{ close }">
      <UButton
        :loading
        :label="$t('sale_suspend.label')"
        color="warning"
        @click="suspend"
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

  const emit = defineEmits(['suspended']);
  const sale = defineModel();
  const { suspendItem } = useSales();
  const toast = useToast();
  const trans = useTranslation();
  const open = ref(false);
  const loading = ref(false);

  const suspend = async () => {
    if (!sale.value?.id) return;
    loading.value = true;
    await suspendItem(sale.value.id);
    emit('suspended');
    loading.value = false;
    open.value = false;
    toast.add({
      title: trans('sale_suspend.done'),
      icon: 'tabler:shopping-cart-pause',
    });
  };
</script>
