import { useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import type { Occupation } from '../constants/Rooms';
import type { AgendaEvent } from '../model/AgendaEvent';
import type { Room } from '../model/Room';
import { roomService } from '../services/RoomService';
import Icon from './common/Icon';
import View from './common/View';

type Props = {
  room: Room;
  dayId?: string;
  events?: AgendaEvent[];
};

export default function OccupationStats(props: Props) {
  const [stats, setStats] = useState<Occupation[]>([]);

  useEffect(() => {
    if (props.events) {
      roomService
        .getRoomOccupationStatsFromEvents(props.room, props.events)
        .then((stats) => {
          setStats(stats);
        });
    } else if (props.dayId) {
      roomService
        .getRoomOccupationStats(props.room, props.dayId)
        .then((stats) => {
          setStats(stats);
        });
    }
  }, [props.dayId, props.room, props.events]);

  const colorByOccupationRate = (rate: number | undefined) => {
    if (rate === undefined) {
      return Colors.gray;
    }
    if (rate >= 0.9) {
      return Colors.red;
    } else if (rate >= 0.75) {
      return Colors.orange;
    } else if (rate >= 0.5) {
      return Colors.orange2;
    } else {
      return Colors.green;
    }
  };

  return (
    <>
      {!stats || stats.filter((s) => s.tables > 0).length === 0 ? (
        <span style={{}}>Disponible toute la journée</span>
      ) : (
        <div style={{}}>
          {stats &&
            stats.map((st) => (
              <View key={st.hour} style={{}}>
                <span>
                  {st.tables > 0 && st.tables < st.roomCapacity ? (
                    st.tables
                  ) : (
                    <Icon
                      icon={st.tables === 0 ? 'check_circle' : 'block'}
                      color={st.tables === 0 ? Colors.green : Colors.red}
                    />
                  )}
                </span>
                <View style={{}}>
                  <View style={{}} />
                </View>
                {st.hour.endsWith('h') ? <span>{st.hour}</span> : <span />}
              </View>
            ))}
        </div>
      )}
    </>
  );
}
