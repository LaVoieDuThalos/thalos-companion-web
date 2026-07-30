import './NextOpenDateTime.scss';

type Props = {
  open: boolean;
};

export default function NextOpenDateTime({ open }: Props) {
  return (
    <div className={`next-open-datetime ${open ? 'room-open' : 'room-closed'}`}>
      {open && <span>La salle est ouverte !</span>}
      {!open && (
        <span>
          Ouverture : <strong>Vendredi 31 Juillet</strong> à{' '}
          <strong>20h</strong>
        </span>
      )}
    </div>
  );
}
