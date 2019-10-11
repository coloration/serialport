// miniprogram/pages/jpword.js
import words from './words'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    word: null
  },

  nextWord () {
    const idx = this.data.index === words.length - 1 ? 0 : this.data.index + 1
    this.setWord(idx)
  },

  prevWord () {
    const idx = this.data.index === 0 ? words.length - 1 : this.data.index - 1
    this.setWord(idx)
  },

  setWord (idx) {
    this.setData({
      index: idx,
      word: words[idx],
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
    this.setData({
      index: 0,
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