import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-8">
          The job agent engine.
        </h1>
        
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex-1">
              <label htmlFor="what" className="block text-xs font-bold text-gray-700 uppercase">What</label>
              <input
                type="text"
                id="what"
                className="block w-full border-none p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Job title, keywords, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex-1">
              <label htmlFor="where" className="block text-xs font-bold text-gray-700 uppercase">Where</label>
              <input
                type="text"
                id="where"
                className="block w-full border-none p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="City, state, zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out md:w-auto w-full"
          >
            Find jobs
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500">
           <span className="font-semibold text-gray-700">Popular searches:</span> Software Engineer, Product Manager, Data Scientist
        </div>
      </div>
    </div>
  );
}
