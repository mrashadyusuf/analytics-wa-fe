import mock from './mock'

// AUTH
import './apis/auth/auth'

// SYSTEM MASTER
import './apis/system-master/system-master'

mock.onAny().passThrough() // forwards the matched request over network
