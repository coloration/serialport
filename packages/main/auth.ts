import { RequestType, UserDto, SigninPayload, ResetPasswordPayload } from '../types'
import { regist } from './requestServer'
import Store from 'electron-store'
import defaultUserInfos from './template/user.json'

const USERINFO_STORE_KEY = 'COAL_USER'

const userStore = new Store()

// userStore.delete(USERINFO_STORE_KEY)

const oldUserInfo = userStore.get(USERINFO_STORE_KEY) 

if (!oldUserInfo) {
  userStore.set(USERINFO_STORE_KEY, defaultUserInfos)
}

regist(RequestType.SIGNIN, (event: any, param: SigninPayload) => {

  const userInfos = userStore.get(USERINFO_STORE_KEY) as SigninPayload[]


  const user = userInfos.find(u => param.password === u.password && param.username === u.username)
  if (user) Reflect.deleteProperty(user, 'password')
  event.reply(
    user 
      ? { status: 200, message: '登录成功', data: user }
      : { status: 401, message: '账号密码错误', data: user } 
  )
})

regist(RequestType.RESET_PASSWORD, (e: any, params: ResetPasswordPayload) => {
  const userInfos = userStore.get(USERINFO_STORE_KEY) as SigninPayload[]
  const user = userInfos.find(u => u.username = params.username)
  if (!user) return e.reply({ status: 404, message: '没有此用户' })
  else if (user.password !== params.password) return e.reply({ status: 403, message: '原始密码错误' }) 

  user.password = params.newPassword
  userStore.set(USERINFO_STORE_KEY, userInfos)
  return e.reply({ status: 200, message: '修改成功' })
})