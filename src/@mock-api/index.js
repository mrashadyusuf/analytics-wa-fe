import mock from './mock'

// AUTH
import './apis/auth/auth'

mock.onAny().passThrough() // forwards the matched request over network
