import { useEffect, useState } from 'react';
import ActivityIndicator from '../../components/common/ActivityIndicator';
import View from '../../components/common/View';
import { Colors } from '../../constants/Colors';
import type { RoomKey } from '../../model/RoomKey';
import { keyService } from '../../services/KeyService';
import './Keys.scss';
import RoomKeyCard from './components/RoomKeyCard/RoomKeyCard.tsx';

export default function KeysPage() {
  const [keys, setKeys] = useState<RoomKey[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    keyService
      .findAllKeys()
      .then((keys) => {
        setKeys(keys.sort(sortByName));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <span>Gestion des badges de la salle</span>

      <div>
        {loading ? (
          <View style={{}}>
            <ActivityIndicator color={Colors.red} size={50} />
          </View>
        ) : null}
        {!loading ? (
          <div className="keys">
            {keys.map((k) => (
              <RoomKeyCard key={k.id} roomKey={k} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const sortByName = (a: RoomKey, b: RoomKey) => a.name.localeCompare(b.name);