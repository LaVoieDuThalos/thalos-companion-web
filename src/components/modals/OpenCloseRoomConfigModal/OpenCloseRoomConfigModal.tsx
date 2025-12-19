import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import type { GameDay } from '../../../model/GameDay';
import type { OpenCloseRoom } from '../../../model/Room';
import type { User } from '../../../model/User';
import { calendarService } from '../../../services/CalendarService';
import { roomService } from '../../../services/RoomService';
import { userService } from '../../../services/UserService';
import { printGameDay } from '../../../utils/Utils';
import CustomCard from '../../common/CustomCard/CustomCard';
import Icon from '../../common/Icon';
import type {
  ModalAction,
  ModalPageProps,
} from '../../common/ModalPage/ModalPage';
import ModalPage from '../../common/ModalPage/ModalPage';

import './OpenCloseRoomConfigModal.scss';
import { ROLE_OUVREUR } from '../../../constants/Roles.ts';

type Props = ModalPageProps & {
  day: GameDay;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function OpenCloseRoomConfigModal({
  day,
  onSuccess,
  onCancel,
  ...props
}: Props) {
  const [loading, setLoading] = useState(false);

  const hours = calendarService.hours(8, [15, 30, 45]);

  const [users, setUsers] = useState<User[]>([]);

  const [model, setModel] = useState<OpenCloseRoom>({
    dayId: day.id,
    openAt: '20h',
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      roomService.getOpenCloseConfig(day.id),
      userService.findAllUsers(),
    ]).then(([model, users]) => {
      setUsers(users.filter((u) => !!u.name));
      setModel(model);
      setLoading(false);
    });
  }, [day.id]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: loading,
      variant: 'secondary',
      onClick: () => onCancel(),
    },
    {
      name: 'save',
      label: 'Enregistrer',
      disabled: loading,
      onClick: () => {
        setLoading(true);
        roomService
          .saveOpenCloseConfig({...model, validated: true} as OpenCloseRoom)
          .then(() => {
            onSuccess();
            setLoading(false);
          })
          .catch(() => setLoading(false));
      },
    },
  ];

  const onOpenerChange = (userId: string) => {
    userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new Error('User not found : id=' + userId);
      }
      setModel((prev) => ({
        ...prev,
        opener: { id: userId, name: user?.name || '' },
        closer: prev.closer ?? { id: userId, name: user?.name || '' },
      }));
    });
  };

  const onCloserChange = (userId: string) => {
    userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new Error('User not found : id=' + userId);
      }
      setModel((prev) => ({
        ...prev,
        closer: { id: userId, name: user?.name || '' },
      }));
    });
  };

  return (
    <ModalPage
      {...props}
      onHide={onCancel}
      options={{
        title: 'Ouverture et fermeture de la salle',
        actions: ACTIONS,
      }}
    >
      <div className="modal-content">
        <span className="day">{printGameDay(day)}</span>
        <CustomCard>
          <div className="block-title">
            <Icon icon="lock_open" iconSize={20} />
            <span style={{}}>Ouverture</span>
          </div>

          <Form.Group className="mb-3" controlId="eventForm.DateInput">
            <Form.Label>A</Form.Label>
            <Form.Select
              size="lg"
              disabled={loading}
              value={model?.openAt}
              onChange={(h) =>
                setModel((prev) => ({ ...prev, openAt: h.target.value }))
              }
            >
              <option>-</option>
              {hours.map((hh) => (
                <option key={hh} value={hh}>
                  {hh}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventForm.DateInput">
            <Form.Label>Par</Form.Label>
            <Form.Select
              size="lg"
              disabled={loading}
              value={model.opener?.id}
              onChange={({ target: { value } }) => onOpenerChange(value)}
            >
              <option>-</option>
              <optgroup label="Ouvreurs/Ouvreuses">
                {users.filter(u => u.preferences?.roles?.includes(ROLE_OUVREUR.id)).map(usr => (
                  <option key={usr.id} value={usr.id}>
                    {usr.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Autres utilisateurs">
                {users
                .filter(u => !u.preferences?.roles?.includes(ROLE_OUVREUR.id)).map((usr) => (
                <option key={usr.id} value={usr.id}>
                  {usr.name}
                </option>
              ))}
              </optgroup>

            </Form.Select>
          </Form.Group>
        </CustomCard>
        <CustomCard>
          <div className="block-title">
            <Icon icon="lock" iconSize={20} />
            <span>Fermeture</span>
          </div>

          <Form.Group className="mb-3" controlId="eventForm.DateInput">
            <Form.Label>Par</Form.Label>
            <Form.Select
              size="lg"
              disabled={loading}
              value={model.closer?.id}
              onChange={({ target: { value } }) => onCloserChange(value)}
            >
              <option>-</option>
              {users.map((usr) => (
                <option key={usr.id} value={usr.id}>
                  {usr.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </CustomCard>
      </div>
    </ModalPage>
  );
}
