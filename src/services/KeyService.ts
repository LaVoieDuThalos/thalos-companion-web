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

  async updateKey(
    key: RoomKey
  ): Promise<{ key: RoomKey; history: RoomKeyHistory }> {
    const previousKey = await this.findKeyById(key.id);
    const newKey = await this.api.updateKey(key);
    const history = await this.addToHistory({
      date: new Date().toISOString(),
      keyId: key?.id,
      from: previousKey?.owner,
      to: newKey.owner,
    } as RoomKeyHistoryEntry);
    return { key: newKey, history };
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
