<template>
  <NuxtPwaManifest></NuxtPwaManifest>

  <UApp :locale="es" :toaster="{ position: 'top-right' }">
    <UContainer class="min-h-dvh">
      <div v-show="loading" class="bg-white z-50 fixed inset-0 flex flex-1 justify-center items-center">
        <UIcon name="tabler:loader" class="animate-spin text-5xl text-primary"></UIcon>
      </div>

      <div class="grid sm:grid-cols-2 gap-6 py-6 h-full">
        <div class="flex flex-col gap-6">
          <ArticlesList v-model="articles" :is-paid></ArticlesList>

          <div class="grid grid-cols-3 gap-6">
            <SaleList
              :key="listKey"
              @selected="onSelected"
            ></SaleList>

            <SaleSuspend
              v-model="sale"
              :total
              :is-paid
              @suspended="startSale"
            ></SaleSuspend>

            <SaleRemove
              v-model="sale"
              :total
              :is-paid
              @removed="startSale"
            ></SaleRemove>
          </div>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div ref="totalsBoxRef">
              <SummaryTotals
                :subtotal-exempt
                :subtotal-taxed
                :subtotal
                :taxes
                :total
              ></SummaryTotals>
            </div>

            <div :style="`height: ${totalsBoxHeight}px`">
              <SummaryPayments
                :payments
                :payments-total
                :change
              ></SummaryPayments>
            </div>
          </div>

          <AmountPad :is-paid @added="elem => articles.push(elem)" @reset="startSale">
            <PaymentsPad
              v-model="payments"
              :total
              :payments-total
              :change
              :is-paid
            ></PaymentsPad>
          </AmountPad>
        </div>
      </div>
    </UContainer>
  </UApp>
</template>

<script setup>
  import { es } from '@nuxt/ui/locale';
  import Big from 'big.js';

  const { getCurrent, setCurrentItem, storeItem, updateItem, suspendItem, finishItem } = useSales();
  const totalsBoxRef = ref();
  const totalsBoxHeight = ref(210);
  const articles = ref([]);
  const payments = ref([]);
  const loading = ref(true);
  const sale = ref();
  const listKey = ref(0);

  const subtotalExempt = computed(() => articles.value
    .filter(elem => Big(elem.tax).eq(0))
    .reduce((acc, elem) => acc.plus(elem.amount), Big(0))
    .toFixed(2));

  const subtotalTaxed = computed(() => articles.value
    .filter(elem => Big(elem.tax).gt(0))
    .reduce((acc, elem) => acc.plus(elem.amount), Big(0))
    .toFixed(2));

  const subtotal = computed(() => Big(subtotalExempt.value).plus(subtotalTaxed.value).toFixed(2));

  const taxes = computed(() => Big(subtotalTaxed.value).times(0.07).toFixed(2));

  const total = computed(() => Big(subtotal.value).plus(taxes.value).toFixed(2));

  const paymentsTotal = computed(() => payments.value
    .map(elem => elem.value)
    .reduce((acc, elem) => acc.plus(elem), Big(0))
    .toFixed(2));

  const change = computed(() => {
    const paid = Big(paymentsTotal.value);
    return paid.gt(total.value) ? paid.minus(total.value).toFixed(2) : '0.00';
  });

  const isPaid = computed(() => {
    const bigTotal = Big(total.value);
    const bigPayments = Big(paymentsTotal.value);
    return bigTotal.gt(0) && bigPayments.gte(bigTotal);
  });

  const onSelected = async (val) => {
    await suspendItem(sale.value.id);
    sale.value = await setCurrentItem(val.id);
    articles.value = sale.value.articles;
    payments.value = sale.value.payments;
    listKey.value++;
  };

  const startSale = async () => {
    sale.value = await storeItem();
    articles.value = [];
    payments.value = [];
    listKey.value++;
  };

  const setSaleWatchers = () => {
    watch([articles, payments], () => {
      if (loading.value || !sale.value) return;
      nextTick(async () => {
        sale.value = await updateItem(sale.value.id, {
          ...sale.value,
          articles: articles.value,
          payments: payments.value,
          subtotalExempt: subtotalExempt.value,
          subtotalTaxed: subtotalTaxed.value,
          subtotal: subtotal.value,
          taxes: taxes.value,
          total: total.value,
          paymentsTotal: paymentsTotal.value,
          change: change.value,
        });
        if (isPaid.value) {
          sale.value = await finishItem(sale.value.id);
          listKey.value++;
        }
      });
    }, { deep: true });
  };

  const getCurrentSale = async () => {
    loading.value = true;
    sale.value = await getCurrent();
    articles.value = [...sale.value.articles];
    payments.value = [...sale.value.payments];
    loading.value = false;
    setSaleWatchers();
  };

  const setTotalsBoxHeight = () => totalsBoxHeight.value = totalsBoxRef.value.offsetHeight;

  onMounted(() => {
    getCurrentSale();
    window.addEventListener('resize', setTotalsBoxHeight);
    nextTick(setTotalsBoxHeight);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setTotalsBoxHeight);
  });
</script>
