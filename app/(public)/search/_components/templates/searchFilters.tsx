import FilterSelect from '@/app/(public)/search/_components/ingredients/filterSelect';

export type FilterState = {
    orderBy: string;
    routeFor: string;
    month: string;
}

type Props = {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

const SORT_OPTIONS = [
    { value: 'relevant', label: '関連度が高い' },
    { value: 'latest', label: '最新順' },
    { value: 'likes', label: 'いいね順' },
];

const ROUTE_FOR_OPTIONS = [
    { value: '', label: 'すべて' },
    { value: 'family', label: 'ファミリー' },
    { value: 'couples', label: 'カップル' },
    { value: 'friends', label: '友達' },
    { value: 'solo', label: 'ソロ' },
];

const MONTH_OPTIONS = [
    { value: '', label: 'すべての季節' },
    { value: '1', label: '1月' },
    { value: '2', label: '2月' },
    { value: '3', label: '3月' },
    { value: '4', label: '4月' },
    { value: '5', label: '5月' },
    { value: '6', label: '6月' },
    { value: '7', label: '7月' },
    { value: '8', label: '8月' },
    { value: '9', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
];

export default function SearchFilters({ filters, onFiltersChange }: Props) {
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">フィルター</h3>
            </div>

            <FilterSelect
                label="並べ替え"
                icon="🔄"
                value={filters.orderBy}
                options={SORT_OPTIONS}
                onChange={(value) => handleFilterChange('orderBy', value)}
            />

            <FilterSelect
                label="ルートのタイプ"
                icon="👥"
                value={filters.routeFor}
                options={ROUTE_FOR_OPTIONS}
                onChange={(value) => handleFilterChange('routeFor', value)}
            />

            <FilterSelect
                label="季節"
                icon="🌳"
                value={filters.month}
                options={MONTH_OPTIONS}
                onChange={(value) => handleFilterChange('month', value)}
            />
        </div>
    );
}
