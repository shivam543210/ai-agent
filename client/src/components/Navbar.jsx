import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-blue-600">JobAgent</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:border-gray-300">
                Find jobs
              </Link>
              <Link to="#" className="border-transparent text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-700 hover:border-gray-300">
                Company reviews
              </Link>
              <Link to="#" className="border-transparent text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:text-gray-700 hover:border-gray-300">
                Salary guide
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
             <button className="text-blue-600 font-bold text-sm px-4 py-2 hover:bg-blue-50 rounded-md">
                Sign in
             </button>
             <div className="h-6 w-px bg-gray-300 mx-2"></div>
             <button className="text-gray-500 font-medium text-sm px-4 py-2 hover:bg-gray-100 rounded-md">
                Employers / Post Job
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
