import { usePage } from '@inertiajs/react';

export default function usePermission() {
    const { props } = usePage();
    const auth = (props as any).auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const can = (perm: string | string[]) => {
        if (Array.isArray(perm)) {
            return perm.some((p) => permissions.includes(p));
        }
        return permissions.includes(perm);
    };

    const hasRole = (role: string | string[]) => {
        if (Array.isArray(role)) {
            return role.some((r) => roles.includes(r));
        }
        return roles.includes(role);
    };

    return { can, hasRole };
}
// This hook checks if the user has the required permissions.
// It returns a function `can` that can be used to check for single or multiple permissions.
// Usage example:
// const { can } = usePermission();
// if (can('edit-post')) {
//     // User can edit posts
// }
// if (can(['edit-post', 'delete-post'])) {
//     // User can edit or delete posts
// }
// This is useful for conditionally rendering UI elements or enabling/disabling actions based on user permissions
// in a React application using Inertia.js.
