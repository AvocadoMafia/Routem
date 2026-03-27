'use client';

import { FiRotateCcw, FiUsers, FiCalendar } from 'react-icons/fi';
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
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'latest', label: 'Latest' },
    { value: 'likes', label: 'Most Liked' },
];

const ROUTE_FOR_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'family', label: 'Family' },
    { value: 'couples', label: 'Couples' },
    { value: 'friends', label: 'Friends' },
    { value: 'solo', label: 'Solo' },
];

const MONTH_OPTIONS = [
    { value: '', label: 'All Seasons' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

export default function SearchFilters({ filters, onFiltersChange }: Props) {
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="h-full flex flex-col p-6 gap-6">
            <div className="hidden md:block border-b border-grass pb-4">
                <h3 className="text-lg font-bold text-foreground-0 uppercase tracking-widest">Filter</h3>
            </div>

            <div className="flex-1 space-y-6 h-fit no-scrollbar">
                <FilterSelect
                    label="Sort By"
                    icon={<FiRotateCcw className="inline" size={18} />}
                    value={filters.orderBy}
                    options={SORT_OPTIONS}
                    onChange={(value) => handleFilterChange('orderBy', value)}
                />

                <FilterSelect
                    label="Route Type"
                    icon={<FiUsers className="inline" size={18} />}
                    value={filters.routeFor}
                    options={ROUTE_FOR_OPTIONS}
                    onChange={(value) => handleFilterChange('routeFor', value)}
                />

                <FilterSelect
                    label="Season"
                    icon={<FiCalendar className="inline" size={18} />}
                    value={filters.month}
                    options={MONTH_OPTIONS}
                    onChange={(value) => handleFilterChange('month', value)}
                />
            </div>
        </div>
    );
}
