import type { GameDay } from '../../model/GameDay';
import CountingFormModal from '../modals/CountingFormModal/CountingFormModal';

type Props = {
  day: GameDay;
};

export default function Countings({ day }: Props) {
  return (
    <CountingFormModal
      show
      dayId={day.id}
      title="Comptages"
      onCancel={() => {}}
      onSuccess={() => {}}
    />
  );
}
