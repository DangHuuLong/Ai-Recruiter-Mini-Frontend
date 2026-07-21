type LineListFieldProps = {
  label: string;
  value: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
};

export function LineListField({ label, value, placeholder, onChange }: LineListFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </label>
      <textarea
        value={value.join('\n')}
        onChange={(event) => onChange(event.target.value.split('\n'))}
        rows={3}
        placeholder={placeholder ?? 'One per line'}
        className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
      />
    </div>
  );
}
