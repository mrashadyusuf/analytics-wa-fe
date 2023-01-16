import chance from '@/@mock-api/chance'

const items = Array.from({ length: 31 }, () => {
  return {
    id: chance.guid(),
    system_category:  `CATEGORY ${chance.string({ length: 3, alpha: true, numeric: false }).toUpperCase()}`,
    system_sub_category: `SUB CATEGORY ${chance.character({ alpha: false, numeric: true })}`,
    system_code: `CODE ${chance.string({ length: 2, alpha: false, numeric: true })}`,
    system_value: chance.word({ length:  6 }).toUpperCase(),
  }
})

export default items