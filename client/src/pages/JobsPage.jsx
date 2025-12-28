import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, MoreHorizontal, Zap } from 'lucide-react';

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (initialQuery) {
      fetchJobs(initialQuery);
    }
  }, [initialQuery]);

  const fetchJobs = async (q) => {
    setLoading(true);
    setJobs([]);
    try {
      const res = await fetch('http://localhost:8000/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error(e);
      alert("Failed to search jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(query);
  };

  const handleAutoApply = async () => {
    if (jobs.length === 0) return;
    setApplying(true);
    setLogs(prev => [...prev, "Starting Auto-Apply sequence..."]);
    
    for (const job of jobs) {
        setLogs(prev => [...prev, `Applying to ${job.title} at ${job.company}...`]);
        try {
             const res = await fetch('http://localhost:8000/api/jobs/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job }),
            });
            const result = await res.json();
             setLogs(prev => [...prev, `-> Result: ${result.message || 'Done'}`]);
        } catch(e) {
             setLogs(prev => [...prev, `-> Failed to apply: ${e.message}`]);
        }
    }
    setApplying(false);
    setLogs(prev => [...prev, "Auto-Apply sequence completed."]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Search Bar (Top on Mobile, Sidebar on Desktop sort of, but usually top in Indeed) */}
      
      {/* Left Column: Job Feed */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
                {query ? `${query} jobs` : 'Job Feed'}
            </h2>
             <button
                onClick={handleAutoApply}
                disabled={loading || applying || jobs.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-white transition
                    ${loading || applying || jobs.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'}
                `}
            >
                <Zap className="h-4 w-4" />
                {applying ? 'Applying...' : 'Auto Apply to All'}
            </button>
        </div>

        {/* Filter Bar (Dummy) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['Date Posted', 'Remote', 'Salary', 'Job Type', 'Education'].map(f => (
                <button key={f} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full border border-gray-300 whitespace-nowrap">
                    {f}
                </button>
            ))}
        </div>

        {loading ? (
             <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
                ))}
             </div>
        ) : (
            <div className="space-y-4">
                {jobs.map((job, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition duration-150 cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 underline-offset-2 decoration-blue-600 group-hover:underline">
                                {job.title}
                            </h3>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal /></button>
                        </div>
                        <div className="mt-1 text-gray-700">
                            {job.company}
                        </div>
                        <div className="mt-2 text-gray-600 text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Remote / USA</span>
                        </div>
                        
                        <div className="mt-4">
                             <div className="bg-gray-100 text-gray-700 text-xs font-bold uppercase py-1 px-2 rounded inline-block gap-1">
                                <span className="align-middle">Easily apply</span>
                             </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-500 line-clamp-3">
                            <ul className="list-disc pl-4">
                                {job.description.split('. ').slice(0, 3).map((s, i) => (
                                    <li key={i}>{s}.</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-400">
                            Just posted
                        </div>
                    </div>
                ))}
                
                {!loading && jobs.length === 0 && (
                     <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                     </div>
                )}
            </div>
        )}
      </div>

      {/* Right Column: Logs / Details (Hidden on small screens) */}
      <div className="hidden lg:block w-96 pl-8 border-l border-gray-200">
         <div className="sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-[500px] overflow-y-auto font-mono text-xs text-gray-700">
                {logs.length === 0 ? (
                    <span className="text-gray-400 italic">Logs will appear here during auto-apply...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-100 pb-1">{log}</div>
                    ))
                )}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Job Agent Running</h4>
                <p className="text-sm text-blue-600">
                    Your agent is active and ready to process applications. ensure your resume and profile are up to date.
                </p>
            </div>
         </div>
      </div>

    </div>
  );
}
