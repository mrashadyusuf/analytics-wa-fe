import chance from '@/@mock-api/chance'

export const fields = [
  'id',
  'system_category',
  'system_sub_category',
  'system_code',
  'system_value',
]

export const items = Array.from({ length: 31 }, () => {
  return {
    id: chance.guid(),
    system_category:  `CATEGORY ${chance.string({ length: 3, alpha: true, numeric: false }).toUpperCase()}`,
    system_sub_category: `SUB CATEGORY ${chance.character({ alpha: false, numeric: true })}`,
    system_code: `CODE ${chance.string({ length: 2, alpha: false, numeric: true })}`,
    system_value: chance.word({ length:  6 }).toUpperCase(),
  }
})
