export const pluck = (p, arr) => arr.map((o) => o[p])
export const apply = (fn, arr) => fn.apply(null, arr)
export const splitEvery = (w, a) => {
  if (!a) return a
  const tot = a.length
  let out = []
  let pos = 0
  while (pos < tot) {
    let got = a.slice(pos, pos + w)
    out = out.concat(got)
    pos += got.length
  }
  return out
}
export const last = (arr) => arr.slice(-1)
export const head = (arr) => arr.slice(0, 1)
export const tail = (arr) => arr.slice(1)
export const concat = (one, two) => {
  if (Array.isArray(one)) return [].concat(one, two)
  return '' + one + two
}
export const transpose = (arr) => {
  return arr[0].map((_, i) => {
    return arr.map((v) => v[i])
  })
}
export const intersperse = (c, a) => {
  return a.reduce((all, v, i) => {
    if (i === a.length - 1) {
      all.push(v)
      return all
    }
    all.push(v, c)
    return all
  }, [])
}
