import { useState } from 'react';

import ModalPage from '../../common/ModalPage/ModalPage';
import { type Procedure, PROCEDURES } from '../../../constants/Procedures.tsx';
import IconButton from '../../common/IconButton/IconButton.tsx';

type Props = {
  show: boolean;
  onHide: () => void;
};

export default function OpenCloseChecklistsModal({ ...props }: Props) {
  const [procedures, setProcedures] = useState<Procedure[]>(PROCEDURES);
  const [selectedProcedureId, setSelectedProcedureId] =
    useState<Procedure['id']>('opening');

  const selectedProcedure =
    procedures.find((procedure) => procedure.id === selectedProcedureId) ??
    procedures[0];

  const toggleStep = (procedureId: Procedure['id'], stepIndex: number) => {
    setProcedures((currentProcedures) =>
      currentProcedures.map((procedure) => {
        if (procedure.id !== procedureId) {
          return procedure;
        }

        return {
          ...procedure,
          steps: procedure.steps.map((step, index) =>
            index === stepIndex ? { ...step, completed: !step.completed } : step
          ),
        };
      })
    );
  };

  return (
    <ModalPage
      {...props}
      options={{
        title: "Procédures d'ouverture et de fermeture",
        actions: [
          {
            name: 'close',
            label: 'Fermer',
            variant: 'secondary',
            onClick: props.onHide,
          },
        ],
      }}
    >
      <div className="open-close-checklists-modal">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {procedures.map((procedure) => (
            <IconButton
              icon={procedure.icon}
              label={procedure.title}
              key={procedure.id}
              variant={
                selectedProcedureId === procedure.id
                  ? 'primary'
                  : 'outline-primary'
              }
              onClick={() => setSelectedProcedureId(procedure.id)}
            >
              {procedure.title}
            </IconButton>
          ))}
        </div>

        <a
          href="https://drive.google.com/file/d/1X1mP4Oqc6VmG34wrb7MwWhL67G5dkqm-/view?usp=sharing"
          target="_blank"
        >
          Consulter la procédure complète
        </a>

        <div className="procedure">
          <h3 className="mb-3">{selectedProcedure.title}</h3>
          <div className="steps">
            {selectedProcedure.steps.map((step, stepIndex) => (
              <div
                key={`${selectedProcedure.id}-${stepIndex}`}
                className={`step border rounded p-3 mb-2 ${
                  step.completed
                    ? 'bg-success-subtle border-success'
                    : 'bg-light'
                }`}
                onClick={() => toggleStep(selectedProcedure.id, stepIndex)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleStep(selectedProcedure.id, stepIndex);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-label d-flex align-items-center gap-2 fw-semibold">
                  <span
                    className={`step-indicator ${
                      step.completed ? 'text-success' : 'text-secondary'
                    }`}
                    aria-label={
                      step.completed ? 'Étape validée' : 'Étape non validée'
                    }
                  >
                    {step.completed ? '✓' : '○'}
                  </span>
                  {step.label}
                </div>
                <div className="step-description text-muted small mt-1">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalPage>
  );
}
