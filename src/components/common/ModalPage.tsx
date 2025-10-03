import { Button, Modal, type ModalProps } from 'react-bootstrap';

export type ModalAction = {
  name: string;
  label?: string;
  color?: string;
  disabled?: boolean;
  onClick: () => void;
};

type ModalPageOptions = {
  title?: string;
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {options?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between', padding: '0px' }}>
        {options?.actions?.length &&
          options?.actions?.map((action: ModalAction) => (
            <Button
              key={action.name}
              style={{}}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label ?? action.name}
            </Button>
          ))}
      </Modal.Footer>
    </Modal>
  );
}
