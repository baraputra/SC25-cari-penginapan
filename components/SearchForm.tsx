import React, { useState } from 'react';
import { type SearchCriteria, RentalPeriod } from '../types';
import { RENTAL_PERIODS } from '../constants';

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [area, setArea] = useState<string>('Soekarno–Hatta International Airport');
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(RentalPeriod.DAILY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ area, rentalPeriod });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-slate-700 mb-1">
              Area Pencarian
            </label>
            <div className="relative">
              <input
                type="text"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bandung, Jawa Barat"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 01-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
              </div>
            </div>
          </div>
           <div>
            <label htmlFor="rentalPeriod" className="block text-sm font-medium text-slate-700 mb-1">
              Masa Sewa
            </label>
            <select
              id="rentalPeriod"
              value={rentalPeriod}
              onChange={(e) => setRentalPeriod(e.target.value as RentalPeriod)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {RENTAL_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mencari...
              </>
            ) : (
              'Cari Penginapan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;