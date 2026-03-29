import { FiChevronDown } from 'react-icons/fi';

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
        <div className="flex flex-col gap-2">
            <div className="relative group">
                {/* MUI-like Outlined Input Container */}
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="peer w-full h-12 pl-10 pr-10 bg-transparent text-foreground-0 text-sm font-medium rounded-xl border border-grass hover:border-accent-0/50 focus:border-accent-0 focus:ring-1 focus:ring-accent-0 outline-none transition-all appearance-none cursor-pointer"
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-background-0 text-foreground-0">
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Left Icon */}
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-1 group-focus-within:text-accent-0 transition-colors pointer-events-none">
                        {icon}
                    </div>

                    {/* Right Chevron Icon */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-1 group-focus-within:text-accent-0 transition-colors pointer-events-none">
                        <FiChevronDown size={18} />
                    </div>

                    {/* Floating Label (MUI Style) */}
                    <label className="absolute left-9 top-1/2 -translate-y-1/2 px-1 text-sm font-bold text-foreground-1 uppercase tracking-widest bg-background-0 pointer-events-none transition-all duration-200
                        peer-focus:-top-0 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-accent-0
                        peer-[:not([value=''])]:-top-0 peer-[:not([value=''])]:left-3 peer-[:not([value=''])]:text-[10px] peer-[:not([value=''])]:text-accent-0
                        group-hover:text-foreground-0 group-focus-within:text-accent-0">
                        {label}
                    </label>
                </div>
            </div>
        </div>
    );
}
