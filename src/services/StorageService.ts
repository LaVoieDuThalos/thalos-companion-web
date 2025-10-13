// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StorageData = any;

export const StorageService = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    } else {
      return null;
    }
  },
  setItem: (key: string, data: StorageData) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

export const AsyncStorageService = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return Promise.resolve(JSON.parse(item));
    } else {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, data: StorageData) => {
    localStorage.setItem(key, JSON.stringify(data));
    return Promise.resolve();
  },
};
