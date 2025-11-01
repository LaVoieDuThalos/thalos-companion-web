import { Button, Modal, type ModalProps } from 'react-bootstrap';

import './ModalPage.scss';

export type ModalAction = {
  name: string;
  label?: string;
  variant?: string;
  disabled?: boolean;
  onClick: () => void;
};

type ModalPageOptions = {
  title?: string;
  hideCloseButton?: boolean;
  fullscreen?: boolean;
  actions?: ModalAction[];
};

export type ModalPageProps = ModalProps & {
  options?: ModalPageOptions;
};

export default function ModalPage({
  options,
  children,
  ...props
}: ModalPageProps) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      fullscreen={true}
    >
      <Modal.Header closeButton={!options?.hideCloseButton}>
        <Modal.Title id="contained-modal-title-vcenter">
          {options?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {options?.actions?.length &&
          options?.actions?.map((action: ModalAction) => (
            <Button
              key={action.name}
              className="modal-action"
              disabled={action.disabled}
              variant={action.variant ?? 'primary'}
              onClick={action.onClick}
            >
              {action.label ?? action.name}
            </Button>
          ))}
      </Modal.Footer>
    </Modal>
  );
}
