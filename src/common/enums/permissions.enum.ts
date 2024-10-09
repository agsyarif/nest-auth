/** 
 * catatan :
 * M_ = manage [can view, create, update, delete]
 * V_ = view 
 * C_ = create
 * U_ = update
 * D_ = delete
 * A_ = assign
 * 
*/

export enum __ {
  M_ARTICLES = 'manage articles',
  V_ARTICLES = 'view articles',
  C_ARTICLES = 'create articles',
  V_ARTICLE = 'view article',
  U_ARTICLES = 'update articles',
  D_ARTICLES = 'delete articles',

  M_USERS = 'manage users',
  V_USERS = 'view users',
  C_USERS = 'create users',
  V_USER = 'view user',
  U_USERS = 'update users',
  D_USERS = 'delete users',
  V_USER_ACCESS = 'view user access',
  A_USER_PERMISSIONS = 'assign user permissions', // assign n permissions to 1 user
  A_USER_ROLES = 'assign user roles', // assign n roles to 1 user

  M_ROLES = 'manage roles',
  V_ROLES = 'view roles',
  C_ROLES = 'create roles',
  V_ROLE = 'view role',
  U_ROLES = 'update roles',
  D_ROLES = 'delete roles',
  V_ROLE_PERMISSIONS = 'view role permissions',
  A_ROLE_PERMISSIONS = 'assign role permissions', // assign n permissions to 1 role
  A_ROLE_TO_USERS = 'assign role to users', // assign 1 role to n users

  M_PERMISSIONS = 'manage permissions',
  V_PERMISSIONS = 'view permissions',
  C_PERMISSIONS = 'create permissions',
  V_PERMISSION = 'view permission',
  U_PERMISSIONS = 'update permissions',
  D_PERMISSIONS = 'delete permissions',
  A_PERMISSION_TO_USERS = 'assign permission to users', // assign 1 permission to n users
  A_PERMISSION_TO_ROLES = 'assign permission to roles', // assign 1 permission to n roles

}