export function SearchSelect({
  options,
  value,
  onChange,
  placeholder,
  icon,
  subtitle,
}: any) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col w-full">
          <span className="text-sm text-gray-500">{placeholder}</span>

          <select
            className="outline-none font-semibold"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select</option>

            {options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}