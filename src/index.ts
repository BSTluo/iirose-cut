import { Context, Schema } from 'koishi'
import { } from 'koishi-plugin-adapter-iirose'

export const name = 'iirose-cut'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  const nowUserList = []
  const whiteList = []
  let status = false

  ctx.on('iirose/newMusic', (session) => {
    if (!status) { return }

    const index = nowUserList.indexOf(session.data.owner)
    const index2 = whiteList.indexOf(session.data.owner)
    
    if (index > -1 || index2 > -1) { return }

    ctx.emit('iirose/cut-one', {})
  })

  ctx.on('iirose/joinRoom', (session) => {
    const index = nowUserList.indexOf(session.data.username)
    
    if (index > -1) { return }
    nowUserList.push(session.data.username)
  })

  ctx.on('iirose/leaveRoom', (session) => {
    const index = nowUserList.indexOf(session.data.username)
    if (index < 0) { return }
    nowUserList.splice(index, 1)
  })

  ctx.command('iirose-cut', '花园自动切歌系统')
    .option('add', '-a <艾特:string> 添加一个人到白名单', { type: /\[\*([\s\S]+)\*\]/ })
    .option('del', '-d <艾特:string> 移除一个人到白名单', { type: /\[\*([\s\S]+)\*\]/ })
    .option('on', '开启自动切歌')
    .option('off', '关闭自动切歌')
    .option('view', '查看当前的列表')
    .usage('\n注意：机器人需要**星标**权限\n每次插件启动时，房间列表会初始化为空，只有当有人主动退出与进入等操作的时候，才会对房间列表进行操作')
    .action(v => {
      if (v.session.platform !== 'iirose') { return ' [IIROSE-CUT] 该平台不支持使用此插件' }
      
      if (v.options.hasOwnProperty('add')) {
        const at = getAt(v.options.add)

        const index = whiteList.indexOf(at)
        if (index > -1) { return '[IIROSE-CUT] 用户已存在白名单' }

        whiteList.push(at)
        return '[IIROSE-CUT] 添加白名单成功'
      }

      if (v.options.hasOwnProperty('del')) {
        const at = getAt(v.options.del)

        const index = whiteList.indexOf(at)
        if (index < 0) { return '[IIROSE-CUT] 该用户不在白名单中' }
        whiteList.splice(index, 1)
      }

      if (v.options.hasOwnProperty('on')) {
        status = true

        return '[IIROSE-CUT] 自动切歌已启动'
      }

      if (v.options.hasOwnProperty('off')) {
        status = false

        return '[IIROSE-CUT] 自动切歌已关闭'
      }


      if (v.options.hasOwnProperty('view')) {
        const nowUserListView = '当前房间人员列表：\n' + nowUserList.map(data=>{
          return `\n [*${data}*] `
        })

        const whiteListView = '当前白名单人员列表：' + whiteList.map(data=>{
          return `\n [*${data}*] `
        })

        return '[IIROSE-CUT] \n\n' + nowUserListView + '\n\n' + whiteListView
      }
    })
}

const getAt = (message: string) => {
  const reg = /\[\*([\s\S]+)\*\]/
  const a = reg.test(message)
  if (!a) { return '' }

  return message.match(reg)[1]
}
