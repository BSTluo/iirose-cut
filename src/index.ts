import { Context, Schema } from 'koishi'
import { } from 'koishi-plugin-adapter-iirose'

export const name = 'iirose-cut'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
}
