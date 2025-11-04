import { Alert } from 'react-bootstrap';
import Icon from '../Icon';
import './FormError.scss';

type Props = {
  error: string;
};

export default function FormError({ error }: Props) {
  return (
    <Alert variant="danger">
      <div className="error-message">
        <Icon icon="error" />
        <span>{error}</span>
      </div>
    </Alert>
  );
}
