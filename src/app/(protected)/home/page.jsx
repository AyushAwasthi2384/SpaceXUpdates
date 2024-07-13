"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from '@/components/LauchCard'
import { fetchLaunches } from '@/lib/features/data/dataSlice';
import { logout } from '@/lib/features/auth/authSlice';

export default function Page() {
  const dispatch = useDispatch();
  const { launches, isLoading, error } = useSelector((state) => state.data);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const launchesPerPage = 12;

  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/logout");
      const data = await response.json();
      if (data.success) {
        dispatch(logout());
        window.location.href = "/";
      } else {
        console.error("An error occurred", data.error);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    dispatch(fetchLaunches());
  }, [dispatch]);

  useEffect(() => {
    setFilteredLaunches(launches);
    setTotalPages(Math.ceil(launches.length / launchesPerPage));
  }, [launches]);

  useEffect(() => {
    filterLaunches();
  }, [search, year, status]);

  const filterLaunches = () => {
    let filtered = launches;

    if (search) {
      filtered = filtered.filter((launch) =>
        launch.mission_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter((launch) => launch.launch_year === year);
    }

    if (status) {
      filtered = filtered.filter((launch) =>
        status === 'successful' ? launch.launch_success : !launch.launch_success
      );
    }

    setFilteredLaunches(filtered);
    setTotalPages(Math.ceil(filtered.length / launchesPerPage));
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1) return;
    if (pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const displayedLaunches = filteredLaunches.slice(
    (currentPage - 1) * launchesPerPage,
    currentPage * launchesPerPage
  );

  return (
    <div>
      <div className="flex sm:flex-col justify-around items-center mx-20 sm:mx-4">
        <div>
          <h1 className="text-4xl font-bold text-center">SpaceX Launches</h1>
        </div>
       <div className="flex items-center">
        <div className="flex justify-between sm:flex-col w-[60%] mx-auto mb-4 p-[1rem] mt-[1rem] sm:gap-[1rem] bg-gray-700 rounded-2xl">
          <input
            type="text"
            placeholder="Search by mission name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full rounded-lg bg-gray-800 outline-none border-gray-300"
            />
          <div className="w-[25rem] sm:w-full sm:grid sm:grid-cols-2 flex gap-[.5rem]">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="outline-none p-2 rounded-lg bg-gray-800 ml-2 sm:ml-0"
              >
              <option value="">Select Year</option>
              {Array.from(
                  { length: new Date().getFullYear() - 2005 + 1 },
                  (_, i) => 2006 + i
                ).map((year) => (
                    <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="outline-none p-2 rounded-lg bg-gray-800"
              >
              <option value="">Select Status</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={() => logoutUser()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-6 sm:p-2 rounded"
            >
            Logout
          </button>
        </div>
        </div> 
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-[2rem]">
            {displayedLaunches.map((launch) => (
              <LaunchCard key={launch.flight_number} launch={launch} />
            ))}
          </div>
          <div className="flex justify-center mb-[2rem]">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}