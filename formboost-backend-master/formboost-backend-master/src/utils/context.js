import { AsyncLocalStorage } from 'node:async_hooks';

const contextStorage = new AsyncLocalStorage();

export const Context = {
  run: (data, fn) => {
    return contextStorage.run(data, fn);
  },
  get: () => {
    return contextStorage.getStore();
  },
  set: (key, value) => {
    const store = contextStorage.getStore();
    if (store) store[key] = value;
  },
};
