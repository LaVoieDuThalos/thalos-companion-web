import type { GameDay } from '../model/GameDay';
import { getWeekNumber } from '../utils/Utils';
import View from './common/View';

type Props = {
  day: GameDay;
};
export default function RoomPriorities({ day }: Props) {
  return (
    <View style={{}}>
      {/* Semaines paires Fig=Grande salle, Algéco=JDS */}
      <View style={{}}>
        <span style={{}}>Grande salle & Annexe</span>
        <span>
          {getWeekNumber(day.date) % 2 === 0 ? 'Figurines' : 'Autres activités'}
        </span>
      </View>
      <View style={{}}>
        <span style={{}}> Algéco</span>
        <span>
          {getWeekNumber(day.date) % 2 === 0 ? 'Autres activités' : 'Figurines'}
        </span>
      </View>
    </View>
  );
}
