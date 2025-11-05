import { useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AlertContext, type Alert } from '../../contexts/AlertsContext';
import { uuid } from '../../utils/Utils';
import ActivityIndicator from './ActivityIndicator';

type AlertComponentProps = { alert: Alert };

function AlertComponent({ alert }: AlertComponentProps) {
  const alertContext = useContext(AlertContext);
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setProcessing(false);
    alertContext.reset();
  };
  const [processing, setProcessing] = useState(false);

  return (
    <Modal show={show} onHide={handleClose} backdrop>
      <Modal.Header closeButton>
        <Modal.Title>{alert.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{alert.message}</p>
      </Modal.Body>

      <Modal.Footer>
        {!processing ? (
          alert.actions?.map((action) => (
            <Button
              variant={action.primary ? 'danger' : 'secondary'}
              key={action.label}
              onClick={() => {
                setProcessing(true);
                action.onClick(handleClose);
              }}
            >
              {action.label}
            </Button>
          ))
        ) : (
          <ActivityIndicator />
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default function Alerts() {
  const alertContext = useContext(AlertContext);

  return (
    <>
      {alertContext.currentAlert ? (
        <AlertComponent
          key={'al-' + uuid()}
          alert={alertContext.currentAlert}
        />
      ) : null}
    </>
  );
}
