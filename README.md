# 寵物認養網站APP
![](https://i.imgur.com/HR51FUJ.jpg)
![](https://i.imgur.com/LQgAYVY.jpg)


## 專案簡介
[Demo網址](https://shiang0504.github.io/pet-finder/)<br>
串接政府資料開放平臺「動物認領養」API，<br>
把冷冰冰的資料用有趣的UI呈現，查詢待領養寵物的過程像在跟狗狗貓貓互動交朋友，<br>
搭配RWD和觸控事件設計，用手機單手也方便操作，<br>
可在喜愛收藏裡面查看待領養寵物的資訊，希望大家領養不棄養。

## 開發工具
* Vite
* Vue3 Composition API
* SCSS

## 其他說明
###### 操作說明
* 加入喜愛收藏：向右滑動=點擊愛心=右方向箭
* 謝謝再聯絡  ：向左滑動=點擊哭臉=左方向箭
* 開啟喜愛收藏：向上滑動=點擊腳掌=上方向箭
* 關閉喜愛收藏：向下滑動=點擊腳掌=下方向箭

###### 篩選功能
* 依據使用者想查看的種類request API

###### 使用者體驗
* 使用touch和keyup事件操作更方便直覺
* 因部分圖片過於龐大，載入時間長影響體驗，但山不轉路轉，多綁一層Background-imege在載入時也有預設的背景畫面呈現
* 有些資料沒有提供照片，沒辦法只好filter掉了

###### 喜愛收藏
* 依據使用者行為將喜愛資料儲存於localstorage

## 出處來源
* 手繪插畫：[loosedrawing](https://loosedrawing.com/)
* API：[政府資料開放平臺](https://data.gov.tw/dataset/85903)