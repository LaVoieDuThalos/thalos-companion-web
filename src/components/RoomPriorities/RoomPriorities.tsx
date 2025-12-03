import type { GameDay } from '../../model/GameDay';
import { getWeekNumber } from '../../utils/Utils';
import Icon from '../common/Icon';

import './RoomPriorities.scss';

type Props = {
  day: GameDay;
};
export default function RoomPriorities({ day }: Props) {
  return (
    <div className="room-priorities">
      <Icon icon="room_preferences" iconSize={22} />
      {/* Semaines paires Fig=Grande salle, Algéco=JDS */}
      <div className="room-priority">
        <span className="room-main-annexe">Grande salle & Annexe :</span>
        <span className="activity room-main-annexe-activity">
          {getWeekNumber(day.date) % 2 === 0 ? 'Figurines' : 'Autres activités'}
        </span>
      </div>
      <div className="room-priority">
        <span className="room-algeco">Algéco :</span>
        <span className="activity room-algeco-other">
          {getWeekNumber(day.date) % 2 === 0 ? 'Autres activités' : 'Figurines'}
        </span>
      </div>
    </div>
  );
}
