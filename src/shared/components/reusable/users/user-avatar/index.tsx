import { FC, useEffect, useState } from "react";
import { GetUser } from "../../../../types/get-user.ts";
import {FileStorageApiClient} from "../../../../../api/clients/file-storage-api-client.ts";

interface UserAvatarProps {
    user: GetUser;
    size?: number;
    className?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, size = 32, className = "" }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function loadImage() {
            if (user?.profilePhotoId) {
                try {
                    const response = await FileStorageApiClient.downloadFile(user.profilePhotoId);
                    const blob = new Blob([response]);
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                } catch {
                    setImageUrl(null);
                }
            } else if (user?.googleProfilePhotoUrl) {
                setImageUrl(user.googleProfilePhotoUrl);
            } else {
                setImageUrl(null);
            }
        }

        loadImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [user?.profilePhotoId, user?.googleProfilePhotoUrl]);

    const getFallbackColor = (email: string) => {
        const colors = [
            "bg-red-200 text-red-800",
            "bg-blue-200 text-blue-800",
            "bg-green-200 text-green-800",
            "bg-yellow-200 text-yellow-800",
            "bg-purple-200 text-purple-800",
            "bg-pink-200 text-pink-800",
            "bg-indigo-200 text-indigo-800",
        ];
        const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const sizeStyle = {
        width: `${size}px`,
        height: `${size}px`
    };

    return imageUrl ? (
        <img
            src={imageUrl}
            alt="User Avatar"
            style={sizeStyle}
            className={`rounded-full object-cover ${className}`}
        />
    ) : (
        <div
            style={sizeStyle}
            className={`flex items-center justify-center rounded-full text-sm font-medium ${getFallbackColor(user.email)} ${className}`}
        >
            {user.email.charAt(0).toUpperCase()}
        </div>
    );
};