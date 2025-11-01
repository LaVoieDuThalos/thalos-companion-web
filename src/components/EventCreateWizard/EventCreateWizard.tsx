import { Button } from 'react-bootstrap';
import {
  CREATION_MODES,
  type EventCreationMode,
} from '../../constants/EventCreationWizard';
import './EventCreateWizard.scss';

type Props = {
  onSelect: (mode: EventCreationMode) => void;
};

export default function EventCreateWizard({ onSelect }: Props) {
  const selectMode = (mode: EventCreationMode) => {
    onSelect(mode);
  };

  return (
    <>
      <p>Quel genre d'évènement souhaitez-vous créer ?</p>
      <div className="creation-modes">
        {CREATION_MODES.map((mode) => (
          <Button
            key={mode.id}
            variant={mode.variant ?? 'secondary'}
            onClick={() => selectMode(mode)}
          >
            {mode.label}
          </Button>
        ))}
      </div>
    </>
  );
}
