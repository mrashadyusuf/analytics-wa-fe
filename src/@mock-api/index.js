import mock from '@/@mock-api/mock'

import '@/@mock-api/api/auth'
import '@/@mock-api/api/systems'
import '@/@mock-api/api/users'

mock.onAny().passThrough() // forwards the matched request over network
