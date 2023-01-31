import chance from '@/@mock-api/chance'

import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'

export const fields = [
  'id',
  'username',
  'email',
  'fullname',
  'avatar',
  'group_code',
  'group_name',
]

export const items = [
  {
    id: chance.guid(),
    username: 'admin@demo.com',
    email: 'admin@demo.com',
    fullname: 'Administrator',
    password: 'admin',
    avatar: avatar1,
    group_code: 'admin',
    group_name: 'Administator',
  },
  {
    id: chance.guid(),
    username: 'client@demo.com',
    email: 'client@demo.com',
    fullname: 'Client',
    password: 'client',
    avatar: avatar2,
    group_code: 'client',
    group_name: 'Client',
  },
]
