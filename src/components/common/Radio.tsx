type Props = {
  label: string;
  value: string;
  disabled?: boolean;
  checked?: boolean;
  onChange: (value: string, checked: boolean) => void;
};

export default function Radio({ label, value, onChange, checked, disabled }: Props) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={!!checked}
        disabled={disabled}
        value={value}
        id={value}
        onChange={() => onChange(value, !checked)}
      />
      <label className="form-check-label" htmlFor={value}>
        {label}
      </label>
    </div>
  );
}
