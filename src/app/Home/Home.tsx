import { useContext, useEffect, useState } from 'react';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import type { SectionListItem } from '../../components/common/SectionList/SectionList';
import SectionList from '../../components/common/SectionList/SectionList';
import View from '../../components/common/View';
import { AppContext } from '../../contexts/AppContext';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';

import { printGameDay } from '../../utils/Utils';
import './Home.scss';
import { useUser } from '../../hooks/useUser.ts';

export default function HomePage() {
  const appContext = useContext(AppContext);

  const {user, activityVisible} = useUser();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<SectionListItem<AgendaEvent>[]>([]);
  const needARefresh = appContext.refreshs['home.events'];
  let evenOrOdd = 0;

  useEffect(() => {
    setLoading(true);
    agendaService.findAllEvents()
      .then((events) => {
        const eventsByDate = events
          .filter((e) => (e.activityId && activityVisible(e.activityId)) || e.creator?.id === user.id)
          .map(mapEventToSectionListItem)
          .reduce(reduceEventsByDate, []);
        setSections(eventsByDate);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fail on findAllEvents', error);
        setLoading(false);
      });
  }, [needARefresh]);

  return (
    <View>
      {!loading ? (
        <>
          {sections.length === 0 ? <p>Aucun évènement prévu</p> : null}
          <SectionList
            sections={sections}
            keyExtractor={(it) => it.id}
            renderSectionHeader={(it) => (
              <span className="section-title">{it.title}</span>
            )}
            renderItem={(it) => (
              <AgendaEventCard event={it} even={evenOrOdd++ % 2 === 0} options={{ hideDate: true }} />
            )}
          ></SectionList>
        </>
      ) : <p>Chargement en cours ...</p>}
    </View>
  );
}

const mapEventToSectionListItem = (e: AgendaEvent) => ({
  title: printGameDay(e.day).toUpperCase(),
  data: [e],
} as SectionListItem<AgendaEvent>)

const reduceEventsByDate = (
  acc: SectionListItem<AgendaEvent>[],
  cur: SectionListItem<AgendaEvent>
) => {
  const foundIndex = acc.findIndex((i) => i.title === cur.title);
  if (foundIndex >= 0) {
    acc[foundIndex].data.push(cur.data[0]);
  } else {
    acc.push(cur);
  }
  return acc;
};