'use client';

import { FiRotateCcw, FiUsers, FiCalendar } from 'react-icons/fi';
import FilterSelect from '@/app/[locale]/(public)/search/_components/ingredients/filterSelect';
import { useTranslations } from 'next-intl';

export type FilterState = {
    orderBy: string;
    routeFor: string;
    month: string;
}

type Props = {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: Props) {
    const t = useTranslations('filter');
    const tCommon = useTranslations('common');
    const tMonths = useTranslations('months');

    const SORT_OPTIONS = [
        { value: 'relevant', label: t('mostRelevant') },
        { value: 'latest', label: t('latest') },
        { value: 'likes', label: t('mostLiked') },
    ];

    const ROUTE_FOR_OPTIONS = [
        { value: '', label: tCommon('all') },
        { value: 'family', label: t('family') },
        { value: 'couples', label: t('couples') },
        { value: 'friends', label: t('friends') },
        { value: 'solo', label: t('solo') },
    ];

    const MONTH_OPTIONS = [
        { value: '', label: t('allSeasons') },
        { value: '1', label: tMonths('jan') },
        { value: '2', label: tMonths('feb') },
        { value: '3', label: tMonths('mar') },
        { value: '4', label: tMonths('apr') },
        { value: '5', label: tMonths('may') },
        { value: '6', label: tMonths('jun') },
        { value: '7', label: tMonths('jul') },
        { value: '8', label: tMonths('aug') },
        { value: '9', label: tMonths('sep') },
        { value: '10', label: tMonths('oct') },
        { value: '11', label: tMonths('nov') },
        { value: '12', label: tMonths('dec') },
    ];
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="h-full flex flex-col p-6 gap-8 bg-background-0/50 backdrop-blur-sm">
            <div className="hidden md:flex items-center gap-3 border-b border-grass pb-6">
                <div className="w-1 h-6 bg-accent-0 rounded-full"></div>
                <h3 className="text-xl font-black text-foreground-0 uppercase tracking-[0.2em]">{t('filter')}</h3>
            </div>

            <div className="flex-1 space-y-10 h-fit no-scrollbar">
                <FilterSelect
                    label={t('sortBy')}
                    icon={<FiRotateCcw size={18} />}
                    value={filters.orderBy}
                    options={SORT_OPTIONS}
                    onChange={(value) => handleFilterChange('orderBy', value)}
                />

                <FilterSelect
                    label={t('routeType')}
                    icon={<FiUsers size={18} />}
                    value={filters.routeFor}
                    options={ROUTE_FOR_OPTIONS}
                    onChange={(value) => handleFilterChange('routeFor', value)}
                />

                <FilterSelect
                    label={t('season')}
                    icon={<FiCalendar size={18} />}
                    value={filters.month}
                    options={MONTH_OPTIONS}
                    onChange={(value) => handleFilterChange('month', value)}
                />
            </div>
            
            <div className="pt-6 border-t border-grass mt-auto">
                <button
                    onClick={() => onFiltersChange({ orderBy: 'relevant', routeFor: '', month: '' })}
                    className="w-full py-3 rounded-xl border border-grass text-foreground-1 text-sm font-bold hover:bg-background-2 transition-colors flex items-center justify-center gap-2"
                >
                    <FiRotateCcw size={14} />
                    {t('resetAll')}
                </button>
            </div>
        </div>
    );
}
