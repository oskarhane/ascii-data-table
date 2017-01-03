export const array = (len) => Array.apply(null, Array(len)).map((_, i) => i)
export const id = (x) => x
export const pluck = (p, arr) => arr.map((o) => o[p])
export const apply = (fn, arr) => fn.apply(null, arr)
export const cMap = (fn) => (arr) => arr.map(fn)
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
export const concat = function (one, two) {
  const concatenated = [].concat(...arguments)
  if (Array.isArray(one)) return concatenated
  return concatenated.join('')
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

export const Either = (x) => x != null ? Right(x) : Left(x)
export const EitherArray = (x) => Array.isArray(x) ? Right(x) : Left(x)

export const Right = (x) => ({
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`,
  log: (str = '') => {
    console.log(str, 'Right', x)
    return Right(x)
  }
})

export const Left = (x) => ({
  chain: (f) => Left(x),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`,
  log: (str = '') => {
    console.log(str, 'Left', x)
    return Left(x)
  }
})
