import MockAdapter from 'axios-mock-adapter'
import axios from '@axios'

// This sets the mock adapter on the axios instance
const mock = new MockAdapter(axios, { delayResponse: 500 })
export default mock
