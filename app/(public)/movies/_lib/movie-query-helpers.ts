export function getArrayParam(param: string | string[] | undefined) {
  if (!param) return []
  return Array.isArray(param) ? param : [param]
}

export function getStringParam(param: string | string[] | undefined) {
  return typeof param === 'string' ? param : undefined
}
