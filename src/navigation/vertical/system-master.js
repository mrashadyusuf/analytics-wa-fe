import constants from "@/plugins/casl/constants"

export default [
  {
    title: 'System Master',
    to: { path: '/system-master' },
    icon: { icon: 'tabler-home-cog' },
    subject: constants.SUBJECT.SYSTEMS,
    action: constants.ACTION.READ,
  },
]
