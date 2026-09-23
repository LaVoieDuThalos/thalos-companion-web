import { useContext, useEffect, useState } from 'react';
import './NextOpenDateTime.scss';
import {
  calendarService,
  SATURDAY,
} from '../../../../services/CalendarService';
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
  const [fridayOpenCloseRoom, setFridayOpenCloseRoom] =
    useState<OpenCloseRoom>();
  const [saturdayOpenCloseRoom, setSaturdayOpenCloseRoom] =
    useState<OpenCloseRoom>();
  const [open, setOpen] = useState<boolean>(false);
  const appContext = useContext(AppContext);

  const needARefresh = appContext.refreshs['header.next-open-datetime'];
  useEffect(() => {
    const nextFridayDay = calendarService.nextFridayGameDay();
    const nextSaturday = calendarService.nextSaturdayGameDay();

    roomService
      .getOpenCloseConfig(nextFridayDay.id)
      .then((config: OpenCloseRoom) => {
        setFridayOpenCloseRoom(config);
      });

    roomService
      .getOpenCloseConfig(nextSaturday.id)
      .then((config: OpenCloseRoom) => {
        setSaturdayOpenCloseRoom(config);
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
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          Prochaines ouvertures :{' '}
          {calendarService.now().date.getDay() != SATURDAY && (
            <div>
              <strong>
                {today === fridayOpenCloseRoom?.dayId
                  ? "Aujourd'hui"
                  : DaysOfWeek[
                      new Date(fridayOpenCloseRoom?.dayId || '').getDay()
                    ]}{' '}
              </strong>
              à <strong>{fridayOpenCloseRoom?.openAt}</strong> (
              {fridayOpenCloseRoom?.validated ? (
                <strong>{`par ${fridayOpenCloseRoom?.opener?.name}`}</strong>
              ) : (
                'non confirmé'
              )}
              )
            </div>
          )}
          <div>
            <strong>
              {today === saturdayOpenCloseRoom?.dayId
                ? "Aujourd'hui"
                : DaysOfWeek[
                    new Date(saturdayOpenCloseRoom?.dayId || '').getDay()
                  ]}{' '}
            </strong>
            à <strong>{saturdayOpenCloseRoom?.openAt}</strong> (
            {saturdayOpenCloseRoom?.validated ? (
              <strong>{`par ${saturdayOpenCloseRoom?.opener?.name}`}</strong>
            ) : (
              'non confirmé'
            )}
            )
          </div>
        </div>
      )}
    </div>
  );
}
