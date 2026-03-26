type Option = {
    value: string;
    label: string;
}

type Props = {
    label: string;
    icon: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

export default function FilterSelect({ label, icon, value, options, onChange }: Props) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {icon} {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
