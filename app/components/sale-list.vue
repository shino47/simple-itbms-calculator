<template>
  <USlideover
    v-model:open="open"
    :title="$t('sale_list.title')"
    :ui="{ body: 'sm:py-4' }"
    side="left"
    @after:enter="onOpen"
    @after:leave="onClose"
  >
    <UButton
      :label="$t('sale_list.label')"
      class="w-full h-16 inline-block text-2xl shadow"
    ></UButton>

    <template #body>
      <UProgress
        v-if="loading"
        indeterminate
        size="xs"
        class="absolute top-0 inset-x-0 z-1"
      ></UProgress>

      <div v-if="isEmpty" class="h-full flex flex-col items-center justify-center gap-2 text-neutral-400">
        <UIcon name="tabler:receipt" class="text-4xl"></UIcon>

        <div>{{ $t('sale_list.empty') }}</div>
      </div>

      <UScrollArea v-else v-slot="{ item }" :items virtualize>
        <div class="py-2">
          <SaleItem :sale="item" @selected="onSelected"></SaleItem>
        </div>
      </UScrollArea>

      <div ref="sentinel" class="text-center">
        <UButton
          v-if="hasMore && !loading"
          :label="$t('load_more')"
          color="neutral"
          variant="outline"
          class="mt-4"
          @click="fetchItems"
        ></UButton>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-6 w-full">
        <div class="flex justify-start gap-1">
          <UButton
            :variant="null == status ? 'solid' : 'outline'"
            :label="$t('sale_list.filters.all')"
            @click="setStatus(null)"
          ></UButton>

          <UButton
            :variant="'suspended' == status ? 'solid' : 'outline'"
            :label="$t('sale_list.filters.suspended')"
            @click="setStatus('suspended')"
          ></UButton>

          <UButton
            :variant="'finished' == status ? 'solid' : 'outline'"
            :label="$t('sale_list.filters.finished')"
            @click="setStatus('finished')"
          ></UButton>
        </div>

        <UButton
          :icon="isAsc ? 'tabler:sort-ascending' : 'tabler:sort-descending'"
          @click="changeOrder"
        ></UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
  const emit = defineEmits(['selected']);
  const { getList } = useSales();
  const open = ref(false);
  const items = ref([]);
  const isAsc = ref(false);
  const status = ref(null);
  const lastId = ref(null);
  const hasMore = ref(true);
  const loading = ref(false);
  const sentinel = ref(null);
  let observer = null;

  const isEmpty = computed(() => items.value.length <= 0 && !hasMore.value);

  const fetchItems = async () => {
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    try {
      const data = await getList(25, isAsc.value, status.value, lastId.value);
      items.value.push(...data.items);
      lastId.value = data.nextAfterId;
      hasMore.value = data.hasMore;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    items.value = [];
    lastId.value = null;
    hasMore.value = true;
  };

  const setStatus = (value) => {
    reset();
    status.value = value;
    fetchItems();
  };

  const changeOrder = () => {
    reset();
    isAsc.value = !isAsc.value;
    fetchItems();
  };

  const setObserver = () => {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        fetchItems();
      }
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });
    if (sentinel.value) {
      observer.observe(sentinel.value);
    }
  };

  const onOpen = () => {
    nextTick(setObserver);
    if (!items.value.length) {
      fetchItems();
    }
  };

  const onClose = () => {
    if (observer) {
      observer.disconnect();
    }
  };

  const onSelected = (val) => {
    if ('current' == val.status) {
      open.value = false;
    } else {
      emit('selected', val);
    }
  };

  onBeforeUnmount(onClose);
</script>
