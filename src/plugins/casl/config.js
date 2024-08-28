import constants from './constants'

export const initialAbility = [
  { subject: constants.SUBJECT.AUTH, action: constants.ACTION.READ },
  { subject: constants.SUBJECT.ERROR, action: constants.ACTION.READ },
]

const parseActions = permission => {
  const actions = []
  if (permission.read === constants.STATUS.YES) {
    actions.push(constants.ACTION.READ )
  }
  if (permission.create === constants.STATUS.YES) {
    actions.push(constants.ACTION.ADD )
  }
  if (permission.update === constants.STATUS.YES) {
    actions.push(constants.ACTION.EDIT)
  }
  if (permission.delete === constants.STATUS.YES) {
    actions.push(constants.ACTION.DELETE)
  }
  if (permission.download === constants.STATUS.YES) {
    actions.push(constants.ACTION.DOWNLOAD)
  }

  return actions.length < 5 ? actions : [constants.ACTION.MANAGE]
}

// to do update depend on api response
export const parseAbility = permissions => {
  const abilities = [
    { subject: constants.SUBJECT.AUTH, action: constants.ACTION.READ },
    { subject: constants.SUBJECT.ERROR, action: constants.ACTION.READ },
    { subject: constants.SUBJECT.PROFILE, action: constants.ACTION.MANAGE },
  ]

  if (permissions && Array.isArray(permissions)) {
    for (let iP = 0; iP < permissions.length; iP++) {
      const actions = parseActions(permissions[iP])
      for (let iA = 0; iA < actions.length; iA++) {
        abilities.push({
          subject: permissions[iP].function_id,
          action: actions[iA],
        })
      }
    }
  }

  return abilities
}

export const firstMenu = abilities => {
  const menus = [
    { id: constants.SUBJECT.DASHBOARD, path: constants.PATH.DASHBOARD },
    { id: constants.SUBJECT.SYSTEMS, path: constants.PATH.SYSTEMS },
    { id: constants.SUBJECT.USERS, path: constants.PATH.USERS },
    { id: constants.SUBJECT.GROUPS, path: constants.PATH.GROUPS },
    { id: constants.SUBJECT.PROFILE, path: constants.PATH.PROFILE },
  ]

  let menu = null
  for (let iMenu = 0; iMenu < menus.length; iMenu++) {
    for (let iAbility = 0; iAbility < abilities.length; iAbility++) {
      if (menus[iMenu].id === abilities[iAbility].subject) {
        menu = menus[iMenu]
        break
      }
    }

    if (menu) {
      break
    }
  }

  return menu || { id: constants.SUBJECT.PROFILE, path: constants.PATH.PROFILE }
}

export const _ = undefined
