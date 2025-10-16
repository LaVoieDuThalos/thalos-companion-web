import { useContext, useEffect, useState } from 'react';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import type { SectionListItem } from '../../components/common/SectionList/SectionList';
import SectionList from '../../components/common/SectionList/SectionList';
import View from '../../components/common/View';
import { Months } from '../../constants/Months';
import { AppContext } from '../../contexts/AppContext';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';
import { settingsService } from '../../services/SettingsService';

import './Home.scss';

export default function HomePage() {
  const appContext = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<SectionListItem<AgendaEvent>[]>([]);
  const needARefresh = appContext.refreshs['home.events'];

  useEffect(() => {
    setLoading(true);
    settingsService
      .get()
      .then((user) =>
        agendaService.findAllEvents().then((events) => ({ events, user }))
      )
      .then(({ events, user }) => {
        const eventsByMonth = events
          .filter(
            (e) =>
              user?.preferences &&
              settingsService.activityVisible(
                user?.preferences,
                e.activityId ?? e.activity?.id ?? ''
              )
          )
          .map((e) => ({
            title: Months[e.day.date.getMonth()].toUpperCase(),
            data: [e],
          }))
          .reduce(
            (
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
            },
            []
          );
        setSections(eventsByMonth);
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
            renderItem={(it) => <AgendaEventCard event={it} />}
          ></SectionList>
        </>
      ) : (
        'Chargement en cours ...'
      )}
    </View>
  );
}
