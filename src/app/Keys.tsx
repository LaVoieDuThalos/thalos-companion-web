import { useEffect, useState } from 'react';
import ActivityIndicator from '../components/common/ActivityIndicator';
import View from '../components/common/View';
import RoomKeyCard from '../components/RoomKeyCard';
import { Colors } from '../constants/Colors';
import type { RoomKey } from '../model/RoomKey';
import type { User } from '../model/User';
import { keyService } from '../services/KeyService';

export default function KeysPage() {
  const [keys, setKeys] = useState<RoomKey[]>([]);
  const [loading, setLoading] = useState(false);

  const changeKeyOwner = (user: User, key: RoomKey) => {
    setLoading(true);
    keyService
      .updateKey({
        ...key,
        owner: {
          id: user.id,
          name: user.name ?? '',
        },
      })
      .then((res) => {
        const foundIndex = keys.findIndex((k) => k.id === res.id);
        if (foundIndex >= 0) {
          const newKeys = [...keys];
          newKeys[foundIndex] = { ...res };
          setKeys(newKeys);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    keyService
      .findAllKeys()
      .then((keys) => {
        setKeys(keys.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <View style={{}}>
      <span style={{}}>Badges de la salle</span>
      <View style={{}}>
        {loading ? (
          <View style={{}}>
            <ActivityIndicator color={Colors.red} size={50} />
          </View>
        ) : null}
        {!loading ? (
          <div>
            {keys.map((k) => (
              <RoomKeyCard
                key={k.id}
                roomKey={k}
                onChangeOwner={(user) => changeKeyOwner(user, k)}
              />
            ))}
          </div>
        ) : null}
      </View>
    </View>
  );
}
