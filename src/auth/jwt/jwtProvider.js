import axios from '@axios'
import JwtService from './jwtService'
import jwtConfig from './jwtConfig'

const jwtProvider = new JwtService(axios, jwtConfig)

export default jwtProvider
