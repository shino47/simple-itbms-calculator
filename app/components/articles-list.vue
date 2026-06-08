<template>
  <div ref="itemsBoxRef" class="flex flex-1">
    <Transition name="fade" mode="out-in">
      <div
        v-if="!items.length"
        class="bg-white shadow rounded flex flex-1 flex-col justify-center items-center gap-4 text-neutral-400"
      >
        <UIcon name="tabler:shopping-cart" class="text-4xl"></UIcon>

        <div class="text-xl">{{ $t('items_list_empty') }}</div>
      </div>

      <div
        v-else
        ref="listBox"
        class="flex flex-1 flex-col gap-3 pb-1 relative overflow-y-auto"
        :style="`height: ${itemsBoxHeight}px`"
      >
        <TransitionGroup name="slideY">
          <div v-for="item in items" :key="item.id" class="p-4 bg-white shadow rounded">
            <div class="flex justify-between items-center gap-4">
              <UButton
                v-if="!props.isPaid"
                color="error"
                icon="tabler:trash"
                variant="outline"
                @click="remove(item)"
              ></UButton>

              <div class="flex-1">
                <div class="flex justify-between gap-4 text-xl">
                  <div>
                    <span>{{ item.qty }}</span>
                    <span class="mx-2">&times;</span>
                    <span>{{ item.price }}</span>
                  </div>

                  <span class="font-semibold">{{ item.amount }}</span>
                </div>

                <USeparator class="my-1"></USeparator>

                <div class="text-right">
                  <span class="mr-1 text-sm text-neutral-400">{{ $t('tax') }}:</span>
                  <span class="font-semibold">{{ item.tax }}</span>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  const props = defineProps({
    isPaid: {
      type: Boolean,
      required: true,
    },
  });

  const items = defineModel();
  const itemsBoxRef = ref();
  const itemsBoxHeight = ref(733);
  const listBox = ref();

  const remove = (item) => {
    items.value = items.value.filter(elem => elem.id != item.id);
  };

  const setItemsBoxHeight = () => itemsBoxHeight.value = itemsBoxRef.value.offsetHeight;

  onMounted(() => {
    window.addEventListener('resize', setItemsBoxHeight);
    nextTick(setItemsBoxHeight);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setItemsBoxHeight);
  });

  watch(() => items.value.length, (newLength, oldLength) => {
    if (oldLength > newLength) return;
    nextTick(() => {
      listBox.value?.scrollTo({
        top: listBox.value?.scrollHeight,
        behavior: 'smooth',
      });
    });
  });
</script>
