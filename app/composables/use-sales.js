import { openDB } from 'idb';

export default function () {
  const tableName = 'sales';

  const conn = openDB('simple-itbms-calculator', 1, {
    upgrade (db) {
      const store = db.createObjectStore(tableName, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('status', 'status');
      store.createIndex('status_id', ['status', 'id']);
      store.createIndex('currentKey', 'currentKey', {
        unique: true,
      });
    },
  });

  const getListRange = (asc, status, afterId) => {
    if (status && afterId) {
      return asc
        ? IDBKeyRange.bound([status, afterId], [status, Infinity], true, false)
        : IDBKeyRange.bound([status, -Infinity], [status, afterId], false, true);
    }
    if (status) {
      return IDBKeyRange.bound([status, -Infinity], [status, Infinity]);
    }
    if (afterId) {
      return asc
        ? IDBKeyRange.lowerBound(afterId, true)
        : IDBKeyRange.upperBound(afterId, true)
    }
    return null;
  };

  const getList = async (limit=25, asc=false, status=null, afterId=null) => {
    const db = await conn;
    const tx = db.transaction(tableName, 'readonly');
    const store = status ? tx.objectStore(tableName).index('status_id') : tx.objectStore(tableName);
    const range = getListRange(asc, status, afterId);
    const items = [];
    let cursor = await store.openCursor(range, asc ? 'next' : 'prev');
    let nextAfterId = null;
    while (cursor && items.length < limit) {
      items.push(cursor.value);
      nextAfterId = cursor.value.id;
      cursor = await cursor.continue();
    }
    await tx.done;
    return {
      items,
      nextAfterId,
      hasMore: items.length === limit,
    };
  };

  const getItem = async (id) => {
    const db = await conn;
    return db.get(tableName, id);
  };

  const storeItem = async () => {
    const db = await conn;
    const newItem = {
      articles: [],
      payments: [],
      subtotalExempt: '0.00',
      subtotalTaxed: '0.00',
      subtotal: '0.00',
      taxes: '0.00',
      total: '0.00',
      paymentsTotal: '0.00',
      change: '0.00',
      status: 'current',
      currentKey: 'current',
      createdAt: Date.now(),
    };
    const id = await db.add(tableName, newItem);
    return {
      ...newItem,
      id,
    };
  };

  const getCurrent = async () => {
    const db = await conn;
    const current = await db.getFromIndex(tableName, 'currentKey', 'current');
    return current || await storeItem();
  };

  const updateItem = async (id, data) => {
    const db = await conn;
    const item = await db.get(tableName, id);
    if (!item) {
      throw new Error(`Record ${id} not found.`);
    }
    const updatedItem = {
      ...item,
      ...data,
      articles: JSON.parse(JSON.stringify(toRaw(data.articles))),
      payments: JSON.parse(JSON.stringify(toRaw(data.payments))),
    };
    await db.put(tableName, updatedItem);
    return updatedItem;
  };

  const updateItemStatus = async (id, status) => {
    const db = await conn;
    const item = await db.get(tableName, id);
    if (!item) {
      throw new Error(`Record ${id} not found.`);
    }
    const updatedItem = {
      ...item,
      status,
      statusAt: Date.now(),
    };
    delete updatedItem.currentKey;
    await db.put(tableName, updatedItem);
    return updatedItem;
  };

  const suspendItem = async (id) => await updateItemStatus(id, 'suspended');

  const finishItem = async (id) => await updateItemStatus(id, 'finished');

  const setCurrentItem = async (id) => {
    const db = await conn;
    const item = await db.get(tableName, id);
    if (!item) {
      throw new Error(`Record ${id} not found.`);
    }
    const updatedItem = {
      ...item,
      currentKey: 'current',
      status: 'current',
      statusAt: Date.now(),
    };
    await db.put(tableName, updatedItem);
    return updatedItem;
  };

  const removeItem = async (id) => {
    const db = await conn;
    return await db.delete(tableName, id);
  };

  return {
    conn,
    getList,
    getItem,
    getCurrent,
    storeItem,
    updateItem,
    suspendItem,
    finishItem,
    setCurrentItem,
    removeItem,
  }
}
