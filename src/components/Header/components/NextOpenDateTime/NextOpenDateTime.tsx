import { useContext, useEffect, useState } from 'react';
import './NextOpenDateTime.scss';
import { calendarService } from '../../../../services/CalendarService';
import { roomService } from '../../../../services/RoomService';
import type { OpenCloseRoom } from '../../../../model/Room';
import { DaysOfWeek } from '../../../../constants/Months';
import { formatDate } from '../../../../utils/Utils';
import { AppContext } from '../../../../contexts/AppContext';

type Props = {
  clickable?: boolean;
  onClick?: () => void;
};

export default function NextOpenDateTime({ onClick, clickable }: Props) {
  const [openCloseRoom, setOpenCloseRoom] = useState<OpenCloseRoom>();
  const [open, setOpen] = useState<boolean>(false);
  const appContext = useContext(AppContext);

  const needARefresh = appContext.refreshs['header.next-open-datetime'];
  useEffect(() => {
    const nextGameDay = calendarService.nextGameDayFromNow();
    roomService
      .getOpenCloseConfig(nextGameDay.id)
      .then((config: OpenCloseRoom) => {
        setOpenCloseRoom(config);
      });

    roomService.isRoomOpenFromDate(new Date()).then((isOpen) => {
      setOpen(isOpen);
    });
  }, [needARefresh]);

  const today = formatDate(new Date());

  return (
    <div className={`next-open-datetime ${open ? 'room-open' : 'room-closed'}`}>
      {open && <span>La salle est ouverte !</span>}
      {!open && (
        <div
          onClick={() => clickable && onClick?.()}
          className={clickable ? 'next-open-datetime-clickable' : undefined}
        >
          Prochaine ouverture :{' '}
          <strong>
            {today === openCloseRoom?.dayId
              ? "Aujourd'hui"
              : DaysOfWeek[new Date(openCloseRoom?.dayId || '').getDay()]}{' '}
          </strong>
          à <strong>{openCloseRoom?.openAt}</strong> (
          {openCloseRoom?.validated ? (
            <strong>{`par ${openCloseRoom?.opener?.name}`}</strong>
          ) : (
            'non confirmé'
          )}
          )
        </div>
      )}
    </div>
  );
}
