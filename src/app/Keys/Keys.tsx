import { useEffect, useState } from 'react';
import ActivityIndicator from '../../components/common/ActivityIndicator';
import View from '../../components/common/View';
import RoomKeyCard from '../../components/RoomKeyCard/RoomKeyCard';
import { Colors } from '../../constants/Colors';
import type { RoomKey } from '../../model/RoomKey';
import { keyService } from '../../services/KeyService';
import './Keys.scss';

export default function KeysPage() {
  const [keys, setKeys] = useState<RoomKey[]>([]);
  const [loading, setLoading] = useState(false);

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
      <span style={{}}>Gestion des badges de la salle</span>

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
    </View>
  );
}
