'use client';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: 'text' | 'email' | 'url' | 'textarea';
  placeholder?: string;
}

export default function EditableField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}: EditableFieldProps) {
  const inputClass =
    'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 bg-white';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
