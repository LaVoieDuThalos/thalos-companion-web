import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { calendarService } from '../../services/CalendarService';
import { clamp, eventIsInTimeSlot, fromRoomId } from '../../utils/Utils';
import CustomCard from '../common/CustomCard/CustomCard';
import Icon from '../common/Icon';
import Tag from '../common/Tag/Tag';
import './RoomPlanning.scss';

type Props = {
  roomId: string;
  day: GameDay;
  events: AgendaEvent[];
};

type Dimensions = {
  l: number;
  t: number;
  w: number;
  h: number;
};

type TimeWindow = {
  hourStart: number;
  startTimestamp: number;
  hourEnd: number;
  endTimestamp: number;
};

const LayoutConfig = {
  rowHeight: 30,
  gap: 0,
};

export default function RoomPlanning({ day, roomId, events }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const room = fromRoomId(roomId);
  const [dimensions, setDimensions] = useState<Dimensions>({
    l: 0,
    t: 0,
    w: 100,
    h: 50,
  });

  const [timeWindow, setTimeWindow] = useState<TimeWindow>({
    hourStart: 14,
    startTimestamp: day.date.getTime(),
    hourEnd: 19,
    endTimestamp: day.date.getTime(),
  });

  const eventsVisibles = events.filter((event) =>
    eventIsInTimeSlot(event, timeWindow.startTimestamp, timeWindow.endTimestamp)
  );

  const navigate = useNavigate();

  const hours = calendarService.hours(
    timeWindow.hourStart,
    [30],
    false,
    timeWindow.hourEnd
  );

  const updateDimensions = () =>
    setDimensions({
      l: parentRef.current?.offsetLeft || 0,
      t: parentRef.current?.offsetTop || 0,
      w: parentRef.current?.offsetWidth || 100,
      h: parentRef.current?.offsetHeight || 50,
    });

  const changeTimeWindow = (hourStart: number, hourEnd: number) => {
    const start = new Date(day.date.getTime());
    start.setHours(hourStart);
    const end = new Date(day.date.getTime());
    end.setHours(hourEnd);

    setTimeWindow({
      hourStart,
      startTimestamp: Date.UTC(
        day.date.getFullYear(),
        day.date.getMonth(),
        day.date.getDate(),
        hourStart,
        0,
        0
      ),
      hourEnd,
      endTimestamp: Date.UTC(
        day.date.getFullYear(),
        day.date.getMonth(),
        day.date.getDate(),
        hourEnd,
        0,
        0
      ),
    });
  };

  const layoutEvent: (event: AgendaEvent, index: number) => CSSProperties = (
    event: AgendaEvent,
    index = 0
  ) => {
    const pxDurationInMs =
      dimensions.w / (timeWindow.endTimestamp - timeWindow.startTimestamp);
    let left = 0;
    left = Math.floor(
      (event.startTime! - timeWindow.startTimestamp) * pxDurationInMs
    );
    const layout = {
      width:
        event.durationInMinutes === 999
          ? dimensions.w - left
          : clamp(
              event.durationInMinutes * 60 * 1000 * pxDurationInMs +
                (left < 0 ? left : 0),
              0,
              dimensions.w - left
            ),
      height: LayoutConfig.rowHeight * (event.tables || 1),
      left: clamp(left, 0, dimensions.w),
      top: index * (LayoutConfig.rowHeight + LayoutConfig.gap),
      borderLeftColor: event.activity?.style.backgroundColor,
    };
    return layout;
  };

  const computeTop = (event: AgendaEvent, events: AgendaEvent[]) => {
    const index = events.indexOf(event);
    let top = 0;
    for (let i = 0; i < index; i++) {
      top += events[i].tables || 1;
    }
    return top;
  };

  useEffect(() => {
    updateDimensions();
    changeTimeWindow(14, 19);

    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="planning-container" ref={parentRef}>
      <div className="time-window-selector">
        <ButtonGroup>
          <Button
            variant="secondary"
            className={timeWindow.hourStart === 9 ? 'selected' : ''}
            onClick={() => changeTimeWindow(9, 14)}
          >
            Matin
          </Button>
          <Button
            variant="secondary"
            className={timeWindow.hourStart === 14 ? 'selected' : ''}
            onClick={() => changeTimeWindow(14, 19)}
          >
            Après-midi
          </Button>
          <Button
            variant="secondary"
            className={timeWindow.hourStart === 19 ? 'selected' : ''}
            onClick={() => changeTimeWindow(19, 24)}
          >
            Soirée
          </Button>
        </ButtonGroup>
      </div>
      <div className="header">
        {hours.map((hh) => (
          <div key={hh} className="cell">
            {hh.endsWith('h30') ? '' : hh}
          </div>
        ))}
      </div>

      <div className="events">
        <div className="tables">
          {Array(room?.capacity).fill(
            <div
              className="planning-table"
              style={{
                width: dimensions.w,
                height: LayoutConfig.rowHeight + LayoutConfig.gap,
              }}
            >
              <Icon icon="table_restaurant" color="lightgray" iconSize={30} />
            </div>
          )}
        </div>
        {eventsVisibles.map((event) => (
          <CustomCard
            clickable
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="event"
            style={layoutEvent(event, computeTop(event, eventsVisibles))}
          >
            <div>
              <Tag
                color={event!.activity!.style.backgroundColor}
                textColor={event!.activity!.style.color}
              >
                <span>{event!.activity!.name}</span>
              </Tag>
            </div>
            <div>
              <strong>{event.start}</strong> - {event.title} - [
              {event.room?.name}] ({event.tables} table
              {event.tables || 0 > 1 ? 's' : ''})
            </div>
          </CustomCard>
        ))}
      </div>
    </div>
  );
}
