import constants from "@/plugins/casl/constants"

export default [

  {
    title: 'Transaction',
    to: { path: '/transaction' },
    icon: { icon: 'tabler-credit-card-pay' },
    subject: constants.SUBJECT.SYSTEMS,
    action: constants.ACTION.READ,
  },
]
