import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Colors } from '../../constants/Colors';
import { ROOMS } from '../../constants/Rooms';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { fromRoomId } from '../../utils/Utils';
import Icon from '../common/Icon';
import Row from '../common/Row';
import RoomPlanning from '../RoomPlanning/RoomPlanning';

type Props = { day: GameDay; events: AgendaEvent[] };

export default function GameDayRoomsOccupation({ day, events }: Props) {
  const [currentRoom, setCurrentRoom] = useState(ROOMS[0]);

  return (
    <>
      <hr />
      <Row>
        <Icon icon="table_restaurant" iconSize={20} color={Colors.gray} />
        <span>Salle</span>
        <Form.Select
          onChange={(e) =>
            setCurrentRoom(() => {
              const newRoom = fromRoomId(e.target.value);
              if (!newRoom) {
                return ROOMS[0];
              }
              return newRoom;
            })
          }
        >
          {ROOMS.map((r) => (
            <option value={r.id} key={r.id}>
              {r.name}
            </option>
          ))}
        </Form.Select>
      </Row>
      {day && (
        <RoomPlanning
          day={day}
          roomId={currentRoom.id}
          events={events.filter((e) => e.roomId === currentRoom.id)}
        />
      )}
    </>
  );
}
