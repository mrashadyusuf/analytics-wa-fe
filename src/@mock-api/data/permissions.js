import chance from '@/@mock-api/chance'
import { items as groups } from '@/@mock-api/data/groups'

const status = Object.freeze({
  YES: 'Y',
  NO: 'N',
})

export const functions = [
  { function_id: 'Dashboard', function_name: 'Dashboard' },
  { function_id: 'Systems', function_name: 'System Master' },
  { function_id: 'Users', function_name: 'Users' },
  { function_id: 'Groups', function_name: 'Groups' },
]

export const items = Array.from(groups, group => functions.map(fun => {
  const action = {
    read: status.YES,
    create: group.group_code === 'admin' ? status.YES : status.NO,
    update: group.group_code === 'admin' ? status.YES : status.NO,
    'delete': group.group_code === 'admin' ? status.YES : status.NO,
    download: group.group_code === 'admin' ? status.YES : status.NO,
  }

  return {
    id: chance.guid(),
    group_code: group.group_code,
    group_name: group.group_name,
    function_id: fun.function_id,
    function_name: fun.function_name,
    ...action,
  }
})).flat(1)
