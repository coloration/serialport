// miniprogram/pages/jpword.js
import words from './words'


const groupIndexes = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    word: null,
    groupIndex: -1,
  },

  nextWord () {
    let idx = this.data.index + 1
    let gIdx = this.data.groupIndex
    let allIdx = groupIndexes[gIdx] + idx

    if (allIdx === words.length) {
      idx = 0
      gIdx = 0
    }
    else if (allIdx === groupIndexes[gIdx + 1]) {
      idx = 0
      gIdx = gIdx + 1
    }
    this.setWord(gIdx, idx)
  },

  prevWord () {
    let idx = this.data.index - 1
    let gIdx = this.data.groupIndex
    let allIdx = groupIndexes[gIdx] + idx
    
    if (allIdx === -1) {
      gIdx = groupIndexes.length - 1
      idx = words.length - groupIndexes.slice(-1)[0] - 1
    }
    else if (allIdx === groupIndexes[gIdx - 1]) {
      gIdx = gIdx - 1
      idx = allIdx - groupIndexes[gIdx - 1] - 1
    }


    this.setWord(gIdx, idx)
  },

  nextGroup () {
    const gIdx = this.data.groupIndex === groupIndexes.length - 1 ? 0 : this.data.groupIndex + 1
    this.setWord(gIdx, 0)
  },
  prevGroup () {
    const gIdx = this.data.groupIndex === 0 ? groupIndexes.length - 1 : this.data.groupIndex - 1
    this.setWord(gIdx, 0)
  },

  setWord (gIdx, idx) {
    this.setData({
      index: idx,
      groupIndex: gIdx,
      word: words[groupIndexes[gIdx] + idx],
    })
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
    let currentGroup = ''
    words.forEach((word, i) => {
      if (word.group !== currentGroup) {
        currentGroup = word.group
        groupIndexes.push(i)
      }
    })

    this.setData({
      index: 0,
      groupIndex: 0,
      word: words[0]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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