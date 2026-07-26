import { useContext, useEffect, useState } from 'react';
import AgendaEventCard from '../../components/AgendaEventCard/AgendaEventCard';
import type { SectionListItem } from '../../components/common/SectionList/SectionList';
import SectionList from '../../components/common/SectionList/SectionList';
import View from '../../components/common/View';
import { AppContext } from '../../contexts/AppContext';
import type { AgendaEvent } from '../../model/AgendaEvent';
import { agendaService } from '../../services/AgendaService';

import { isGameDay, printGameDay } from '../../utils/Utils';
import './Home.scss';
import { useUser } from '../../hooks/useUser.ts';
import { Tab, Tabs } from 'react-bootstrap';
import { Globals } from '../../constants/Globals.ts';
import Icon from '../../components/common/Icon.tsx';
import IconWithPill from '../../components/IconWithPill/IconWithPill.tsx';

type TABS = 'planned' | 'non-planned' | 'waiting-for-players';

export default function HomePage() {
  const appContext = useContext(AppContext);

  const { user, activityVisible } = useUser();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<SectionListItem<AgendaEvent>[]>([]);
  const [waitingSections, setWaitingSections] = useState<
    SectionListItem<AgendaEvent>[]
  >([]);
  const needARefresh = appContext.refreshs['home.events'];
  const [key, setKey] = useState<TABS>('planned');
  const [draftSection, setDraftSection] = useState<
    SectionListItem<AgendaEvent> | undefined
  >(undefined);

  let evenOrOdd = 0;

  useEffect(() => {
    setLoading(true);

    agendaService
      .findAllEvents()
      .then((events) => {
        const eventsByDate = events
          .filter(
            (e) =>
              (e.activityId && activityVisible(e.activityId)) ||
              e.creator?.id === user.id
          )
          .map(mapEventToSectionListItem)
          .reduce(reduceEventsByDate, []);
        setSections(
          eventsByDate.filter((section) => section.id !== Globals.DRAFT_ID)
        );
        setWaitingSections(
          eventsByDate
            .map((section) => ({
              ...section,
              data: section.data.filter((e) => !!e.withSubscriptions),
            }))
            .filter((section) => section.data.length > 0)
        );
        setDraftSection(
          eventsByDate.find(
            (section) => section.id === Globals.DRAFT_ID
          ) as SectionListItem<AgendaEvent>
        );
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
          {sections.length === 0 && !loading ? (
            <p>Aucun évènement prévu</p>
          ) : loading ? (
            'Chargement en cours ...'
          ) : null}
          <Tabs
            id="controlled-tab-example"
            className="mb-3"
            activeKey={key}
            onSelect={(k) => setKey(k as TABS)}
          >
            <Tab
              eventKey="planned"
              title={<Icon icon="calendar_check" iconSize={30} />}
            >
              <h3>Evènements à venir</h3>
              <SectionList
                sections={sections}
                keyExtractor={(it) => it.id}
                renderSectionHeader={(it) => (
                  <span className="section-title">{it.title}</span>
                )}
                renderItem={(it) => (
                  <AgendaEventCard
                    event={it}
                    even={evenOrOdd++ % 2 === 0}
                    options={{ hideDate: true }}
                  />
                )}
              ></SectionList>
            </Tab>
            <Tab
              eventKey="non-planned"
              title={<Icon icon="hourglass" iconSize={30} />}
            >
              {draftSection === undefined && (
                <p>Aucun évènement en cours de planification</p>
              )}
              {draftSection !== undefined && (
                <div>
                  <h3>Evènements en cours de planification</h3>
                  {draftSection.data.map((it) => (
                    <div key={it.id} className="section-item">
                      <AgendaEventCard
                        event={it}
                        even={evenOrOdd++ % 2 === 0}
                        options={{ hideDate: true }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Tab>
            <Tab
              eventKey="waiting-for-players"
              title={
                <IconWithPill
                  icon="emoji_people"
                  size={30}
                  value={`${waitingSections.length || 0}`}
                />
              }
            >
              <h3>En recherche de participant</h3>
              <SectionList
                sections={waitingSections}
                keyExtractor={(it) => it.id}
                renderSectionHeader={(it) => (
                  <span className="section-title">{it.title}</span>
                )}
                renderItem={(it) => (
                  <AgendaEventCard
                    event={it}
                    even={evenOrOdd++ % 2 === 0}
                    options={{ hideDate: true }}
                  />
                )}
              ></SectionList>
            </Tab>
          </Tabs>
        </>
      ) : (
        <p>Chargement en cours ...</p>
      )}
    </View>
  );
}

const mapEventToSectionListItem = (e: AgendaEvent) =>
  ({
    id: e.day.id,
    title: isGameDay(e.day)
      ? printGameDay(e.day).toUpperCase()
      : 'Non planifié',
    data: [e],
  }) as SectionListItem<AgendaEvent>;

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
