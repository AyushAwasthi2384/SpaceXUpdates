"use client"
import React, { useEffect, useState } from 'react'
import LaunchCard from '@/components/LauchCard'

export default function Page() {
    const [launches, setLaunches] = useState([])
    const [filteredLaunches, setFilteredLaunches] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const launchesPerPage = 20

    const [search, setSearch] = useState('')
    const [year, setYear] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        const fetchLaunches = async () => {
            setIsLoading(true)
            const response = await fetch(`https://api.spacexdata.com/v3/launches?limit=1000`) // Fetch all launches
            const data = await response.json()
            setLaunches(data)
            setFilteredLaunches(data)
            setTotalPages(Math.ceil(data.length / launchesPerPage))
            setIsLoading(false)
        }

        fetchLaunches()
    }, [])

    useEffect(() => {
        filterLaunches()
    }, [search, year, status])

    const filterLaunches = () => {
        let filtered = launches

        if (search) {
            filtered = filtered.filter(launch =>
                launch.mission_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (year) {
            filtered = filtered.filter(launch =>
                launch.launch_year === year
            )
        }

        if (status) {
            filtered = filtered.filter(launch =>
                status === 'successful' ? launch.launch_success : !launch.launch_success
            )
        }

        setFilteredLaunches(filtered)
        setTotalPages(Math.ceil(filtered.length / launchesPerPage))
        setCurrentPage(1) // Reset to the first page when filters change
    }

    const paginate = (pageNumber) => {
        if (pageNumber < 1) return
        if (pageNumber > totalPages) return
        setCurrentPage(pageNumber)
    }

    const displayedLaunches = filteredLaunches.slice((currentPage - 1) * launchesPerPage, currentPage * launchesPerPage)

    return (
        <div>
            <div className="flex justify-center mb-4 p-[2rem]">
                <input
                    type="text"
                    placeholder="Search by mission name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 rounded-lg border border-blue-500 bg-gray-800 outline-none border-gray-300"
                />
                <div>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 rounded-lg border border-blue-500 bg-gray-800 ml-2">
                        <option value="">Select Year</option>
                        {Array.from({ length: new Date().getFullYear() - 2005 + 1 }, (_, i) => 2006 + i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 rounded-lg border border-blue-500 bg-gray-800 ml-2">
                        <option value="">Select Status</option>
                        <option value="successful">Successful</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>
            {isLoading ? <p>Loading...</p> : (
                <div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 p-[2rem]">
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
    )
}
