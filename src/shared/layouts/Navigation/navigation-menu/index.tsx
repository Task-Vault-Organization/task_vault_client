import { useState, useEffect } from "react";
import { MenuLink } from "./MenuLink.tsx";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../../features/authentication/types/authentication-state.ts";
import { menuItemsConfig } from "../../../../config/menu-items.ts";
import { Dropdown } from "../../../components/reusable/dropdown";
import { AuthenticationService } from "../../../../features/authentication/services/authentication-service.ts";
import {Link} from "react-router";

export function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const isAuthenticated = useAuthenticationStore((state: AuthenticationState) => state.isAuthenticated);

    const { authenticatedMenuItemList, unauthenticatedMenuItemList } = menuItemsConfig;
    const menuItemsList = isAuthenticated ? authenticatedMenuItemList : unauthenticatedMenuItemList;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const renderMenuList = () =>
        menuItemsList.map((mi, index) =>
            <MenuLink key={index} to={mi.to} text={mi.text} />
        );

    function renderMobileMenuIcon() {
        return (
            <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>
        );
    }

    function renderProfile() {
        return (
            <div className="relative">
                <img className="size-8 rounded-md" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
            </div>
        );
    }

    function renderUserSection() {
        return (
            <>
                <div className="mr-3 absolute right-0 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                        <span className="sr-only">View notifications</span>
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </button>
                </div>
                <Dropdown buttonContent={renderProfile()}>
                    <a href="#" className="block px-4 py-2 text-sm text-text-primary" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-text-primary" role="menuitem" tabIndex="-1" id="menu-item-1">Support</a>
                    <a href="#" className="block px-4 py-2 text-sm text-text-primary" role="menuitem" tabIndex="-1" id="menu-item-2">License</a>
                    <a onClick={AuthenticationService.logoutUser} className="cursor-pointer block px-4 py-2 text-sm text-text-primary" role="menuitem" tabIndex="-1" id="menu-item-3">Sign Out</a>
                </Dropdown>
            </>
        );
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
            ${isScrolled ? 'h-14 bg-gray-900 shadow-lg' : 'h-20 bg-transparent'}`}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
                <div className="relative flex h-full items-center justify-between transition-all duration-500 ease-in-out">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {renderMobileMenuIcon()}
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center transition-all duration-500 ease-in-out">
                            <Link to={'/'}>
                                <img
                                    className={`transition-all duration-500 ease-in-out ${isScrolled ? 'h-6' : 'h-8'}`}
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {renderMenuList()}
                            </div>
                        </div>
                    </div>
                    {isAuthenticated && renderUserSection()}
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3">
                        {renderMenuList()}
                    </div>
                </div>
            )}
        </nav>
    );
}