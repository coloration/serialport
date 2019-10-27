import { base, ex } from './fiftyWord'
// miniprogram/pages/fifty.js

const emptyWords = Array.from({ length: 16 }, function (_, i) {
  return { name: '', value: '' }
})

let timer = null
let store = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    finish: [],
    words: emptyWords,
    selected: null,
    hasAppended: false,
    timeCount: 0,
    timer: null
  },

  tap (e) {
    if (this.data.timeCount === 0) {
      clearInterval(timer)
      timer = setInterval(function () {
        this.setData({ timeCount: this.data.timeCount + 1 })
      }.bind(this), 1000)

      
    }

    const selected = this.data.selected
    const newSelect = e.currentTarget.dataset.word
    const finish = this.data.finish.slice()

    if (finish.includes(newSelect)) return 

    if (selected === null) {
      this.setData({ selected: newSelect })
    }
    else {
      const words = this.data.words
      
      if (selected === newSelect) return 
      const sWord = words[selected]
      const nWord = words[newSelect]
      if (
        sWord.value === nWord.value && 
        sWord.name !== nWord.name
      ) {
        finish.push(selected, newSelect)

        if (finish.length === words.length) {
          this.next()
        }
        else {
          this.setData({ finish })
        }
        
      }

      this.setData({ selected: null })
    }
  },
  random (length) {
    let idx = []

    if (length < 32) {
      if (length < 8) {
        idx = Array.from({ length }, function (_, i) { return i })
        
      }
      else {
        idx = [0, 1, 2, 3, 4, 5, 6, 7]
      }
    }
    else {
      while (idx.length < 8) {
        const r = Math.floor(Math.random() * length)
        idx.push(r)
      }
    }

    return idx
  },

  next () {
    if (store.length === 0) {
      clearInterval(timer)
    }
    this.pick()
    this.setData({ finish: [], selected: null })
  },
  pick () {
    
    let words = []
    const idxes = this.random(store.length)
    let hasAppended = this.data.hasAppended

    console.log(store, idxes)
    for (let i = idxes.length - 1; i >= 0; i--) {
      const w = store.splice(idxes[i], 1)
      words.push({ name: w[0][0], value: w[0][1] })
      words.push({ name: w[0][1], value: w[0][1] })
    }

    words.sort(() => Math.random() - 0.5 )

    // if (store.length < 60 && !hasAppended) {
    //   hasAppended = true
    //   store = store.concat(ex)
    // }

    console.log('????', words)
    
    this.setData({ words, hasAppended })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    store = base.slice()
    this.pick()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
    store = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})