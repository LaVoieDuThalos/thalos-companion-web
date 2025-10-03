import { useContext, useEffect, useState } from 'react';
import AgendaEventCard from '../components/AgendaEventCard';
import type { SectionListItem } from '../components/common/SectionList';
import SectionList from '../components/common/SectionList';
import View from '../components/common/View';
import { Months } from '../constants/Months';
import { AppContext } from '../contexts/AppContext';
import type { AgendaEvent } from '../model/AgendaEvent';
import { agendaService } from '../services/AgendaService';
import { settingsService } from '../services/SettingsService';

export default function HomePage() {
  const appContext = useContext(AppContext);

  const [sections, setSections] = useState<SectionListItem<AgendaEvent>[]>([]);
  const needARefresh = appContext.refreshs['home.events'];

  useEffect(() => {
    appContext.setLoading(true);
    settingsService
      .get()
      .then((prefs) =>
        agendaService.findAllEvents().then((events) => ({ events, prefs }))
      )
      .then(({ events, prefs }) => {
        const eventsByMonth = events
          .filter((e) =>
            settingsService.activityVisible(
              prefs,
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
        appContext.setLoading(false);
      })
      .catch((error) => {
        console.error('Fail on findAllEvents', error);
        appContext.setLoading(false);
      });
  }, [needARefresh]);

  return (
    <View>
      {!appContext.loading ? (
        <>
          {sections.length === 0 ? <p>Aucun évènement prévu</p> : null}
          <SectionList
            sections={sections}
            keyExtractor={(it) => it.id}
            renderSectionHeader={(it) => <span style={{}}>{it.title}</span>}
            renderItem={(it) => <AgendaEventCard event={it} />}
          ></SectionList>
        </>
      ) : null}
    </View>
  );
}
