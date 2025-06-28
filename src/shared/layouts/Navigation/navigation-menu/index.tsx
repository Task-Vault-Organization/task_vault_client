import { useState, useEffect } from "react";
import { MenuLink } from "./MenuLink.tsx";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../../features/authentication/types/authentication-state.ts";
import { menuItemsConfig } from "../../../../config/menu-items.ts";
import { Dropdown } from "../../../components/reusable/dropdown";
import { AuthenticationService } from "../../../../features/authentication/services/authentication-service.ts";
import { Link } from "react-router";
import { NotificationRenderer } from "../../../../features/notifications/components/notification-renderer.tsx";
import {
    NotificationState,
    useNotificationStore
} from "../../../../features/notifications/stores/notifications-store.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { UploadProfilePhotoModal } from "../../../components/modals/upload-profile-photo-modal";
import { CustomFileCategoryModal } from "../../../components/modals/custom-file-category-modal";
import { FiUpload, FiLogOut, FiUser, FiFolderPlus } from "react-icons/fi";

export function NavigationMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [customCategoriesModalOpen, setCustomCategoriesModalOpen] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const isAuthenticated = useAuthenticationStore((state: AuthenticationState) => state.isAuthenticated);
    const user = useAuthenticationStore(state => state.user);

    const unreadCount = useNotificationStore((state: NotificationState) =>
        state.notifications.filter(n => n.notificationStatusId === 1).length
    );

    const { authenticatedMenuItemList, unauthenticatedMenuItemList } = menuItemsConfig;
    const menuItemsList = isAuthenticated ? authenticatedMenuItemList : unauthenticatedMenuItemList;

    function formatFileSize(bytes: number): string {
        if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
        if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return bytes + ' B';
    }
    const maxBytes = 200 * 1024 * 1024; // 200 MB
    const usageBytes = user?.totalFileSize || 0;
    const usageRatio = Math.min(usageBytes / maxBytes, 1);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let objectUrl: string | null = null;

        async function loadProfileImage() {
            if (user?.profilePhotoId) {
                try {
                    const response = await FileStorageApiClient.downloadFile(user.profilePhotoId);
                    const blob = new Blob([response]);
                    objectUrl = URL.createObjectURL(blob);
                    setProfileImageUrl(objectUrl);
                } catch {
                    setProfileImageUrl(null);
                }
            } else if (user?.googleProfilePhotoUrl) {
                setProfileImageUrl(user.googleProfilePhotoUrl);
            } else {
                setProfileImageUrl(null);
            }
        }

        loadProfileImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [user?.profilePhotoId, user?.googleProfilePhotoUrl]);

    const renderMenuList = () =>
        menuItemsList.map((mi, index) =>
            <MenuLink key={index} to={mi.to} text={mi.text} />
        );

    const renderMobileMenuIcon = () => (
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

    const renderProfile = () => (
        <div className="relative">
            {profileImageUrl ? (
                <img className="size-8 rounded-md object-cover" src={profileImageUrl} alt="User profile" />
            ) : (
                <div className="size-8 rounded-md bg-gray-700 text-white flex items-center justify-center text-sm uppercase">
                    {user?.email?.[0] ?? ""}
                </div>
            )}
        </div>
    );

    const renderUserSection = () => (
        <>
            <UploadProfilePhotoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <CustomFileCategoryModal isOpen={customCategoriesModalOpen} onClose={() => setCustomCategoriesModalOpen(false)} />
            <div className="mr-3 absolute right-10 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 cursor-pointer">
                <Dropdown
                    buttonContent={
                        <div className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white cursor-pointer">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -bottom-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    }
                    showArrow={false}
                    buttonClassName="p-1 bg-gray-800 rounded-full text-gray-400 hover:text-white"
                >
                    <NotificationRenderer />
                </Dropdown>
            </div>
            <Dropdown buttonContent={renderProfile()}>
                <div className="py-2 w-72 px-3 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 break-all">
                        <FiUser className="text-lg" />
                        <span>{user?.email}</span>
                    </div>
                    <div className="my-2 border-t border-gray-200 opacity-30" />
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 cursor-pointer text-sm rounded-md font-medium"
                    >
                        <FiUpload className="text-gray-300" />
                        Upload Profile Photo
                    </button>
                    <button
                        onClick={() => setCustomCategoriesModalOpen(true)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 cursor-pointer text-sm rounded-md font-medium"
                    >
                        <FiFolderPlus className="text-gray-300" />
                        File Categories
                    </button>
                    <button
                        onClick={AuthenticationService.logoutUser}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm cursor-pointer rounded-md font-medium"
                    >
                        <FiLogOut className="text-gray-300" />
                        Sign Out
                    </button>
                    {user && (
                        <div className="px-4 py-2 text-sm text-gray-300">
                            <div className="mb-1 flex justify-between items-center text-xs">
                                <span>Storage</span>
                                <span>
                                    {formatFileSize(usageBytes)} / 200 MB
                                </span>
                            </div>
                            <div className="w-full h-2 rounded bg-gray-700 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        usageRatio < 0.6 ? 'bg-green-500' :
                                            usageRatio < 0.85 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                    }`}
                                    style={{ width: `${usageRatio * 100}%` }}
                                />
                            </div>
                        </div>

                    )}
                </div>
            </Dropdown>
        </>
    );

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'h-14 bg-gray-900 shadow-lg' : 'h-20 bg-transparent'}`}>
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