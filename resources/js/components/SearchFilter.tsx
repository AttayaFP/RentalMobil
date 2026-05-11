import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash-es';

interface SearchFilterProps {
    routeName: string;
    placeholder?: string;
    showDate?: boolean;
    filters: {
        search?: string;
        date?: string;
    };
}

export default function SearchFilter({ routeName, placeholder = "Cari data...", showDate = true, filters }: SearchFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');

    const debouncedSearch = useMemo(
        () => 
            debounce((searchValue: string, dateValue: string) => {
                router.get(routeName, 
                    { search: searchValue, date: dateValue }, 
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }, 300),
        [routeName]
    );

    useEffect(() => {
        if (search !== (filters.search || '') || date !== (filters.date || '')) {
            debouncedSearch(search, date);
        }
    }, [search, date, debouncedSearch, filters.search, filters.date]);

    const clearFilters = () => {
        setSearch('');
        setDate('');
        router.get(routeName, {}, { preserveState: true, replace: true });
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
            <motion.div 
                initial={false}
                animate={{ width: isExpanded ? '100%' : '300px' }}
                className="relative flex items-center"
            >
                <div className="absolute left-3 text-gray-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => !search && setIsExpanded(false)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm outline-none"
                />
                {search && (
                    <button 
                        onClick={() => setSearch('')}
                        className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </motion.div>

            {showDate && (
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Calendar size={18} />
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm outline-none text-sm"
                        />
                    </div>
                </div>
            )}

            <AnimatePresence>
                {(search || date) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium ml-2"
                    >
                        <X size={16} />
                        Reset
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
