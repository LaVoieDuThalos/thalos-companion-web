import ActivityIndicator from '../ActivityIndicator';
import './Backdrop.scss';

export default function Backdrop() {
  return (
    <div className="backdrop">
      <div>
        <ActivityIndicator size={150} />
        <img
          alt="Logo"
          src={'/thalos-companion-web/icon100.png'}
          width="100"
          height="100"
          className="d-inline-block align-top"
          style={{ marginTop: '-120px' }}
        />
      </div>
    </div>
  );
}
