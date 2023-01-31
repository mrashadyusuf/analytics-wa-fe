import constants from "@/plugins/casl/constants"

export default [
  {
    title: 'User Management',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'Users',
        to: { path: '/user-management/users' },
        subject: constants.SUBJECT.USERS,
        action: constants.ACTION.READ,
      },
      {
        title: 'Groups',
        to: { path: '/user-management/groups' },
        subject: constants.SUBJECT.GROUPS,
        action: constants.ACTION.READ,
      },
    ],
  },
]
