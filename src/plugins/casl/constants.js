const constants = Object.freeze({
  SUBJECT: Object.freeze({
    AUTH: 'Auth',
    ERROR: 'Error',
    DASHBOARD: 'Dashboard',
    SYSTEMS: 'Systems',
    USERS: 'Users',
    GROUPS: 'Groups',
    PROFILE: 'Profile',
  }),
  PATH: Object.freeze({
    DASHBOARD: '/',
    SYSTEMS: '/system-master',
    USERS: '/user-management/users',
    GROUPS: '/user-management/groups',
    PROFILE: '/profile',
  }),
  ACTION: Object.freeze({
    MANAGE: 'manage',
    READ: 'read',
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    DOWNLOAD: 'download',
  }),
  STATUS: Object.freeze({
    YES: 'Y',
    NO: 'N',
  }),
})

export default constants
