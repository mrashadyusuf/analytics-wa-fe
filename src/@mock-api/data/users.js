import chance from '@/@mock-api/chance'

import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'

const items = [
  {
    id: chance.guid(),
    username: 'admin@demo.com',
    email: 'admin@demo.com',
    fullname: 'Administrator',
    password: 'admin',
    avatar: avatar1,
    group: 'admin',
    permissions: [{ action: 'manage', subject: 'all' }],
  },
  {
    id: chance.guid(),
    username: 'client@demo.com',
    email: 'client@demo.com',
    fullname: 'Client',
    password: 'client',
    avatar: avatar2,
    group: 'client',
    permissions: [
      { subject: 'Error', action: 'read' },
      { subject: 'Auth', action: 'read' },
      { subject: 'Profile', action: 'read' },
      { subject: 'Dashboard', action: 'read' },
    ],
  },
]

export default items