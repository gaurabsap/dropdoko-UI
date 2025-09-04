"use client";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        <button
          className="text-gray-500 focus:outline-none lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative mx-4 lg:mx-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            className="w-32 pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none sm:w-64"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center focus:outline-none">
            <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
              <img
                src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                className="object-cover w-full h-full"
                alt="avatar"
              />
            </div>
            <h3 className="mx-2 text-gray-700 font-medium hidden sm:block">Admin</h3>
          </button>
        </div>
      </div>
    </header>
  );
}