type Option = {
    value: string;
    label: string;
}

type Props = {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

export default function FilterSelect({ label, icon, value, options, onChange }: Props) {
    return (
        <div>
            <label className="block text-sm font-semibold text-foreground-0 mb-3">
                <span className="mr-2">{icon}</span>{label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-grass bg-background-1 text-foreground-0 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-0/50 focus:border-accent-0 transition-all hover:border-foreground-1/30 cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
