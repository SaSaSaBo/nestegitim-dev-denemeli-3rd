export enum Role {
    Master = 'master',
    Admin = 'admin',
    User = 'user'
}

export const roles = {
    master: [
            'view_users', 
            'view_courses', 
            'add_users_to_courses',
            'add_courses',
            'delete_users',         
            'delete_courses', 
            'update_users'
    ],
    admin: [
        'view_users', 
        'view_courses',
        'update_users'
    ],
    user: [
        'update_own_profile', 
        'delete_own_profile'
    ],
  };
  