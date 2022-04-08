export function formatNumberAddressToHex (address: number): string {
  // 10 -> 0A
  const v = (address).toString(16)
  return v.length < 2 ? `0${v}` : v
}

export function bufferFromHex (str: string) {
  const bufferArray = new ArrayBuffer(str.length / 2)
  const uint8View = new Uint8Array(bufferArray)
  uint8View.forEach((_, i) => {
    uint8View[i] = parseInt(`0x${str.slice(i * 2, i * 2 + 2)}`)
  })

  return bufferArray
}

export function suffixCrc (str: string): string {

  let wcrc = 0xffff // 16位寄存器预置
  const buffer = bufferFromHex(str)

  const uint8View = new Uint8Array(buffer)

  uint8View.forEach(bf => {

    wcrc ^= bf & 0x00ff // 将8位数据与crc寄存器异或

    for (let j = 0; j < 8; j++) {
      // 判断右移出的是不是1
      if (wcrc & 0x0001) { // 如果是1则与多项式进行异或
        wcrc >>= 1 // 数据右移一位
        wcrc ^= 0xa001 // 与上面的多项式进行异或
      }
      else { // 如果不是1，则直接移出
        wcrc >>= 1
      }
    }
  })

  const CRC_L = wcrc & 0xff
  const CRC_H = wcrc >> 8
  return str + (CRC_L << 8 | CRC_H).toString(16)

}

export class FixLengthQueue<T = any> {
  #list: T[] = []
  #length: number = 0
  constructor (arr: T[] | number) {
    if (Array.isArray(arr)) {
      this.#list = arr
      this.#length = arr.length
    }
    else {
      this.#length = arr
    }
  }

  clear () {
    this.#list.length = 0
    this.#length = 0
  }

  push (item: T) {
    if (this.#list.length === this.#length) {
      this.#list.shift()
    }

    this.#list.push(item)
  }

  shift () {
    if (this.#list.length < this.#length) return
    this.#list.shift()
  }

  getList () {
    return this.#list
  }
}

export function debounce (fn: Function, time: number) {
  let timer: any = undefined
  let enable = true

  return function (...args: any[]) {
    if (!enable) return
    clearTimeout(timer)
    timer = setTimeout(() => {
      typeof fn === 'function' && (fn as any).apply(null, args)
    }, time)

    return function dispose (enable = true) {
      clearTimeout(timer)
      enable = enable
    }
  }
}

export function numberPrefix (placeholder: string | number, length: number, n: any): string {
  let r = String(n)
  placeholder = placeholder || '0'
  length = length || r.length
  while (r.length < length) {
    r = placeholder + r
  }

  return r
}