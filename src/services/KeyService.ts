import { API, type ApiService } from '../api/Api';
import type {
  RoomKey,
  RoomKeyHistory,
  RoomKeyHistoryEntry,
} from '../model/RoomKey';

class KeyService {
  private api: ApiService;

  constructor(api: ApiService) {
    this.api = api;
  }

  findAllKeys(): Promise<RoomKey[]> {
    return this.api.findAllKeys();
  }

  findKeyById(keyId: string): Promise<RoomKey | null> {
    return this.api.findKeyById(keyId);
  }

  updateKey(key: RoomKey): Promise<RoomKey> {
    return this.api.updateKey(key);
  }

  findHistory(keyId: string | undefined): Promise<RoomKeyHistory> {
    if (keyId === undefined) {
      return Promise.resolve([]);
    }
    return this.api.findKeyHistory(keyId);
  }

  addToHistory(entry: RoomKeyHistoryEntry): Promise<RoomKeyHistory> {
    return this.api.addToKeyHistory(entry);
  }
}

export const keyService = new KeyService(API);
