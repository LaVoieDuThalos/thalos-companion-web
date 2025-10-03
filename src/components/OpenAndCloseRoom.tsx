import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Colors } from '../constants/Colors';
import type { GameDay } from '../model/GameDay';
import type { OpenCloseRoom } from '../model/Room';
import { roomService } from '../services/RoomService';
import ActivityIndicator from './common/ActivityIndicator';
import Icon from './common/Icon';
import View from './common/View';

type Props = {
  day: GameDay;
};

export default function OpenAndCloseRoom({ day }: Props) {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<OpenCloseRoom>({
    dayId: day.id,
    openAt: '20h',
  });

  useEffect(() => {
    setLoading(true);
    roomService
      .getOpenCloseConfig(day.id)
      .then((config) => {
        setConfig(config);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [day.id]);

  return (
    <View style={{}}>
      {loading ? <ActivityIndicator color={Colors.red} size={50} /> : null}
      <Card style={{}}>
        <View style={{}}>
          <Icon icon="lock_open" iconSize={30} color={Colors.white} />
        </View>
        <View>
          <span>
            Ouverture à <span style={{}}>{config.openAt}</span>
          </span>
          <span>
            par : <span style={{}}>{config.opener?.name ?? '--'}</span>
          </span>
        </View>
      </Card>
      <Card style={{}}>
        <View>
          <span>Fermeture par :</span>
          <span style={{}}>{config.closer?.name ?? '--'}</span>
        </View>
        <View style={{}}>
          <Icon icon="lock" iconSize={30} color={Colors.white} />
        </View>
      </Card>
    </View>
  );
}
