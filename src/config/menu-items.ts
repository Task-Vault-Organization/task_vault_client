export const menuItemsConfig = {
    unauthenticatedMenuItemList: [
        {
            to: '/login',
            text: 'Log In'
        },
        {
            to: '/sign-up',
            text: 'Sign Up'
        }
    ],
    authenticatedMenuItemList: [
        {
            to: '/home',
            text: 'Home'
        },
        {
            to: '/files/root',
            text: 'My Files'
        },
        {
            to: '/tasks',
            text: 'My Tasks'
        }
    ]
}