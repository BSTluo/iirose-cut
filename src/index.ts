import { Context, Schema } from 'koishi'

export const name = 'iirose-cut'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
}
