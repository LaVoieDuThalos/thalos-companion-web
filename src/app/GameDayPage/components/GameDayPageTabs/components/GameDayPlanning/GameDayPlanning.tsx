import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './GameDayPlanning.scss';
import type { GameDay } from '../../../../../../model/GameDay.ts';
import type { AgendaEvent } from '../../../../../../model/AgendaEvent.ts';
import { AppContext } from '../../../../../../contexts/AppContext.tsx';
import { useUser } from '../../../../../../hooks/useUser.ts';
import type { OpenCloseRoom } from '../../../../../../model/Room.ts';
import { roomService } from '../../../../../../services/RoomService.ts';
import { ROLE_OUVREUR } from '../../../../../../constants/Roles.ts';
import { settingsService } from '../../../../../../services/SettingsService.ts';
import OpenCloseRoomConfigModal
  from '../../../../../../components/modals/OpenCloseRoomConfigModal/OpenCloseRoomConfigModal.tsx';
import CustomCard from '../../../../../../components/common/CustomCard/CustomCard.tsx';
import Label from '../../../../../../components/common/Label.tsx';
import { Colors } from '../../../../../../constants/Colors.ts';
import AgendaEventCard from '../../../../../../components/AgendaEventCard/AgendaEventCard.tsx';

type Props = {
  day: GameDay;
  events: AgendaEvent[];
};
export default function GameDayPlanning({ day, events }: Props) {
  const appContext = useContext(AppContext);
  const user = useUser();
  const navigate = useNavigate();
  const [openCloseModalVisible, setOpenCloseModalVisible] = useState(false);
  const [openClose, setOpenClose] = useState<OpenCloseRoom | undefined>(
    undefined
  );

  useEffect(() => {
    roomService.getOpenCloseConfig(day.id).then((openClose) => {
      setOpenClose(openClose);
    });
  }, []);

  return (
    <>
      {day && settingsService.hasRole(user.user.preferences, ROLE_OUVREUR) ? (
        <OpenCloseRoomConfigModal
          day={day}
          show={openCloseModalVisible}
          onCancel={() => setOpenCloseModalVisible(false)}
          onSuccess={() => {
            appContext.refresh(`agenda.${day.id}`);
            setOpenCloseModalVisible(false);
          }}
        />
      ) : null}
      <div className="planning-content">
        <CustomCard
          clickable={settingsService.hasRole(
            user.user.preferences,
            ROLE_OUVREUR
          )}
          onClick={() =>
            setOpenCloseModalVisible(
              settingsService.hasRole(user.user.preferences, ROLE_OUVREUR)
            )
          }
        >
          <div className="open-close-room-infos">
            Ouverture à{' '}
            <Label
              icon="schedule"
              size={20}
              styles={{ fontWeight: 'bold', color: Colors.red }}
            >
              {openClose?.openAt}
            </Label>
            {openClose?.opener &&
            settingsService.hasRole(user.user.preferences, ROLE_OUVREUR) ? (
              <>
                par{' '}
                <Label
                  icon="person"
                  size={20}
                  styles={{ fontWeight: 'bold', color: Colors.red }}
                >
                  {openClose?.opener?.name}
                </Label>
              </>
            ) : null}
          </div>
        </CustomCard>
        {events?.length === 0 ? (
          <div>
            <span>Rien de prévu pour l&lsquo;instant</span>
          </div>
        ) : (
          events.map((e) => (
            <AgendaEventCard
              key={e.id}
              event={e}
              options={{ hideDate: true }}
              onPress={() => navigate(`/${e.id}`)}
            />
          ))
        )}
        {openClose?.closer &&
          settingsService.hasRole(user.user.preferences, ROLE_OUVREUR) && (
            <CustomCard
              clickable={settingsService.hasRole(
                user.user.preferences,
                ROLE_OUVREUR
              )}
              onClick={() =>
                setOpenCloseModalVisible(
                  settingsService.hasRole(user.user.preferences, ROLE_OUVREUR)
                )
              }
            >
              <div className="open-close-room-infos">
                Fermeture par{' '}
                <Label
                  icon="person"
                  size={20}
                  styles={{ fontWeight: 'bold', color: Colors.red }}
                >
                  {openClose?.closer?.name}
                </Label>
              </div>
            </CustomCard>
          )}
      </div>
    </>
  );
}
