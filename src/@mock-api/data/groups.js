import chance from "@/@mock-api/chance"

export const items = [
  {
    id: chance.guid(),
    group_code: 'admin',
    group_name: 'Administrator',
  },
  {
    id: chance.guid(),
    group_code: 'client',
    group_name: 'Client',
  },
]
