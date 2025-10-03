import ActivityIndicator from './ActivityIndicator';

export default function Backdrop() {
  return (
    <div style={{}}>
      <div>
        <ActivityIndicator size={150} />
        <img
          alt="Logo"
          src={'/thalos-companion-web/icon100.png'}
          width="100"
          height="100"
          className="d-inline-block align-top"
          style={{}}
        />
      </div>
    </div>
  );
}
