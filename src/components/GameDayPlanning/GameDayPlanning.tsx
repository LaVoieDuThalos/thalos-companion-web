import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Colors } from '../../constants/Colors';
import { ROLE_OUVREUR } from '../../constants/Roles';
import { AppContext } from '../../contexts/AppContext';
import { useUser } from '../../hooks/useUser';
import type { AgendaEvent } from '../../model/AgendaEvent';
import type { GameDay } from '../../model/GameDay';
import { type OpenCloseRoom } from '../../model/Room';
import { roomService } from '../../services/RoomService';
import { settingsService } from '../../services/SettingsService';
import AgendaEventCard from '../AgendaEventCard/AgendaEventCard';
import CustomCard from '../common/CustomCard/CustomCard';
import Label from '../common/Label';
import OpenCloseRoomConfigModal from '../modals/OpenCloseRoomConfigModal/OpenCloseRoomConfigModal';
import './GameDayPlanning.scss';

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
            {openClose?.opener ? (
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
        {openClose?.closer && (
          <CustomCard
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
