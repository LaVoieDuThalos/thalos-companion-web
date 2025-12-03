import { Nav } from 'react-bootstrap';
import Icon from '../../../../components/common/Icon.tsx';
import View from '../../../../components/common/View.tsx';
import ActivityIndicator from '../../../../components/common/ActivityIndicator.tsx';
import { Colors } from '../../../../constants/Colors.ts';
import GameDayRoomsOccupation from '../../../../components/GameDayRoomsOccupation/GameDayRoomsOccupation.tsx';
import { useState } from 'react';
import type { GameDay } from '../../../../model/GameDay.ts';
import type { AgendaEvent } from '../../../../model/AgendaEvent.ts';
import GameDayPlanning from './components/GameDayPlanning/GameDayPlanning.tsx';

type Props = {
  day?: GameDay,
  loading: boolean,
  events: AgendaEvent[]
}

export default function GameDayPageTabs({day, loading, events}: Props) {
  const [currentTab, setCurrentTab] = useState('programme');

  return <>
    <div>
      <Nav
        fill
        variant="tabs"
        defaultActiveKey="programme"
        onSelect={(e) => setCurrentTab(e || 'programme')}
      >
        <Nav.Item>
          <Nav.Link eventKey="programme" title="Programme">
            <Icon icon="event_note" iconSize={20} />
            Programme
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="occupation" title="Occupation des salles">
            <Icon icon="room_preferences" iconSize={20} />
            Occupation des salles
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>

    {loading ? (
      <View style={{}}>
        <ActivityIndicator color={Colors.red} size={50} />
      </View>
    ) : null}

    {!loading && day && currentTab === 'programme' ? (
      <GameDayPlanning events={events} day={day} />
    ) : null}
    {!loading && currentTab === 'occupation' && day ? (
      <GameDayRoomsOccupation day={day} events={events} />
    ) : null}
  </>
}