'use client';
import React, { useState, useEffect } from 'react';
import { FiSettings, FiHome, FiMessageSquare, FiStar, FiBell } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import { MdPeopleAlt } from "react-icons/md";
import useFetchUsers from '@/app/hooks/useFetchProfile';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
    const { user, loading, error } = useFetchUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const navItems = [
        { href: "/homepage", Icon: FiHome, label: "Home" },
        { href: "/network", Icon: MdPeopleAlt, label: "My Network" },
        { href: "/messages", Icon: FiMessageSquare, label: "Messages" },
        { href: "/capella", Icon: FiStar, label: "Capella" },
        { href: "/notifications", Icon: FiBell, label: "Notifications" },
    ];

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || loading) {
        return (
            <div className="bg-gray-50">
                <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src="/images/idea.svg"
                                alt="Idea Star"
                                className="h-8 w-auto mr-2"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-gray-800 transition-colors" aria-label="Settings">
                                <FiSettings size={20} />
                            </button>
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                            </div>
                        </div>
                    </div>
                </header>
                <nav className="fixed top-16 left-0 right-0 bg-[#2F5A2B] z-40">
                    <div className="px-4 py-3 flex justify-between">
                        <div className="flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                                />
                                <IoSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            </div>
                        </div>
                        <div className="border-white">
                            <div className="px-4 py-3 flex justify-around gap-30 mr-20">
                                {navItems.map((item, index) => (
                                    <button key={index} className="flex flex-col items-center text-white hover:text-[#AC7A15] transition-colors group">
                                        <item.Icon size={24} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-xs mt-1">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="pt-40">
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 flex items-center justify-center p-4">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src="/images/idea.svg"
                            alt="Idea Star"
                            className="h-8 w-auto mr-2"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-800 transition-colors" aria-label="Settings">
                            <FiSettings size={20} />
                        </button>
                        <div className="relative">
                            <Link href={"/project-page"}><img
                                src={user?.profile_image || "/images/avatar.jpg"}
                                alt={`${user?.first_name || ''} Profile`}
                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            /></Link>
                        </div>
                    </div>
                </div>
            </header>
            <nav className="fixed top-16 left-0 right-0 bg-[#2F5A2B] z-40">
                <div className="px-4 py-3 flex justify-between">
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                            <IoSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        </div>
                    </div>
                    <div className="border-white">
                        <div className="px-4 py-3 flex justify-around gap-30 mr-20">
                            {navItems.map((item, index) => {
                                const { href, label, Icon } = item;
                                const isActive = pathname === href;
                                const className =
                                    "flex flex-col items-center transition-colors group " +
                                    (isActive
                                        ? "text-[#AC7A15]"
                                        : "text-white hover:text-[#AC7A15]");
                                const iconClassName =
                                    "transition-transform " +
                                    (isActive
                                        ? "scale-110"
                                        : "group-hover:scale-110");
                                return (
                                    <Link
                                        key={index}
                                        href={href}
                                        className={className}>
                                        <Icon size={24} className={iconClassName} />
                                        <span className="text-xs mt-1">{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="pt-40">
            </div>
        </div>
    );
};

export default Navigation;