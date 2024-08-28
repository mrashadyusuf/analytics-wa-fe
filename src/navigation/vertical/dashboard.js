import constants from "@/plugins/casl/constants"

export default [
  {
    title: 'Dashboard',
    to: { path: '/' },
    icon: { icon: 'tabler-smart-home' },
    subject: constants.SUBJECT.DASHBOARD,
    action: constants.ACTION.READ,
  },
]
