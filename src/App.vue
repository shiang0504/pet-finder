<script setup>
import { ref, watchEffect, watch, onMounted } from 'vue'
import axios from "axios"
import { touchstartHandler, touchendHandler, touchmoveHandler } from './JS/touch'
import { shuffle } from './JS/shuffle'
import favorPetTemp from './components/favorPet.vue' 

// const itemRefs = ref([])
// onMounted(()=>{
//   console.log('ddd',itemRefs.value)
//   console.log('move',move.value)
//   // itemRefs.value[0].style.transform=move.value
//   // itemRefs.value[0].style.background='red'
// })

// 最愛資料
const favorPet = ref(JSON.parse(localStorage.getItem('pet_favorPet')) || [])
// bind class
const loadingCompleted = ref(true)
const apiErr= ref(false)
const heartAni = ref(false)
// css style bind
const imageMode = ref('cover')

// const isSliding = ref(false)
// const isSliding = ref(true)
// const move = ref('12')

// 最愛資料組件開關
const favorPetWrapHide = ref(true)
// 紀錄貓狗切換開關狀態
const dogStatus = ref(true)
const catStatus = ref(true)
const kind = ref('')
// 點貓狗切換的開關
const dogPress = () =>{
  if(catStatus.value) dogStatus.value=!dogStatus.value
  if(!catStatus.value){
    dogStatus.value=false
    catStatus.value=true
  }
}
const catPress = () =>{
  if(dogStatus.value) catStatus.value=!catStatus.value
  if(!dogStatus.value){
    catStatus.value=false
    dogStatus.value=true
  }
}
// 切換API的網址
watch([dogStatus, catStatus], ()=>{
  if(dogStatus.value && catStatus.value) kind.value=''
  if(dogStatus.value && !catStatus.value) kind.value='狗'
  if(!dogStatus.value && catStatus.value) kind.value='貓'
})
const apiData = ref([]) //api取得的資料
const fiveData = ref([]) //篩選出五筆在畫面上
const sliceStart = ref(0) //篩選起點
const sliceEnd = ref(5) //篩選終點(不包含本身)

// 一開始打一次api 之後貓狗開關切換時再重打
const callApi=()=>{
  console.log('callApi/loading...')
  apiErr.value = false
  loadingCompleted.value = false
  const apiUrl = `https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&animal_kind=${kind.value}`
  apiData.value = []
  axios.get(apiUrl)
  .then(res=>{
    if(res.data.length===0)apiErr.value = true
    return res
  })
  .then(res=>apiData.value.push(...res.data))
  .then(()=>apiData.value = apiData.value.filter(i=>i.album_file.includes('.png')))  //.jpg的相片因憑證問題手機端無法載入
  // .then(()=>apiData.value = apiData.value.filter(i=>i.album_file !== ""))  //刪除沒照片的
  .then(()=>console.log('刪除空白後，拿到'+apiData.value.length+'筆'))
  .then(()=>shuffle(apiData.value))
  .then(()=>console.log('亂數完成'))
  .then(()=>addDefaultBackground())
  .then(()=>fiveData.value = apiData.value.slice(sliceStart.value, sliceEnd.value))
  .then(()=>console.log('首次取得五筆'))
  .then(()=>loadingCompleted.value = true)
  .catch(()=>apiErr.value = true)
}
callApi()
watch(kind, callApi)

const slideToLeft = ref(false)
const slideToRight = ref(false)
// 刪除功能
const deleteFavorPetHandler=(id)=>{
  const index = favorPet.value.findIndex(pet=>pet.animal_id===id)
  if(index!==-1){
    favorPet.value.splice(index, 1)
    localStorage.setItem('pet_favorPet',JSON.stringify(favorPet.value))
  }
}
// 使用者操作(滑動卡片)
// const slideMoving = (moveDistanceX, moveDistanceY) =>{
//   // isSliding.value = true
//   move.value = `perspective(400px) translate3d(${moveDistanceX}px, ${moveDistanceY}px, 0);`
//   // moveX.value = moveDistanceX
//   // moveY.value = moveDistanceY
// }

// 使用者操作(滑動放開或點擊卡片)
const slideEnd = (direction) =>{
  // isSliding.value = false
  if(direction==='left' && slideToLeft.value == false && slideToRight.value == false){ // 左滑
    slideToLeft.value = true
    const timeid = setTimeout(()=>{
      slideToLeft.value = false
      sliceStart.value += 1
      sliceEnd.value += 1
      clearTimeout(timeid)
    },200)
  }else if(direction==='right' && slideToLeft.value == false && slideToRight.value == false){ // 右滑
    slideToRight.value = true
    heartAni.value = true
    favorPet.value.unshift(fiveData.value[0])
    localStorage.setItem('pet_favorPet',JSON.stringify(favorPet.value))
    console.log('進場動畫')
    const timeid = setTimeout(()=>{
      slideToRight.value = false
      console.log('離場動畫')
      sliceStart.value += 1
      sliceEnd.value += 1
      clearTimeout(timeid)
    },200)
  }else if(direction==='up'){
    favorPetWrapHide.value=false
  }else if(direction==='down'){
    favorPetWrapHide.value=true
  }
}
// 滑動改變數值時
watch([sliceStart, sliceEnd], ()=>{
  // 滑到最後重置畫面顯示5筆的範圍
  if(sliceStart.value === apiData.value.length){
    sliceStart.value = 0
    sliceEnd.value = 5
    return
  }
  fiveData.value = apiData.value.slice(sliceStart.value, sliceEnd.value)
  console.log('更新五筆資料')
})

// 在apiData上面隨機加上defaultBackground項目
const addDefaultBackground=()=>{
  const dogBackground = ["dog01.png","dog02.png","dog03.png","dog04.png","dog05.png"]
  const catBackground = ["cat01.png","cat02.png","cat03.png","cat04.png","cat05.png"]
  let fileName = ''
  apiData.value.forEach(i => {
    if(i.animal_kind==='狗'){
      dogBackground.sort(()=>Math.random()-0.5)
      fileName = dogBackground[0]
      i.defaultBackground = fileName
    }
    if(i.animal_kind==='貓'){
      catBackground.sort(()=>Math.random()-0.5)
      fileName = catBackground[0]
      i.defaultBackground = fileName
    }
  })
}
// css style bind 因為有些圖片來源載入太慢 綁雙層背景在載入時墊底 讓使用者體驗較佳
const getBackground = (url, defaultBackground)=>{
  const localUrl = new URL(`./assets/${defaultBackground}`, import.meta.url).href
  return `background: url(${url}) no-repeat center / ${imageMode.value}, rgb(244, 253, 143) url(${localUrl}) no-repeat center / cover`
}
// 監聽鍵盤
const keyupHandler=(event)=>{
  if(event.keyCode===38) slideEnd('up') //鬆開上箭頭
  if(event.keyCode===40) slideEnd('down') //鬆開下箭頭
  if(event.keyCode===37) slideEnd('left') //鬆開左箭頭
  if(event.keyCode===39) slideEnd('right') //鬆開右箭頭
}
window.addEventListener('keyup',keyupHandler)
</script>

<template>
  <div class="wrap">
    <div class="option">
      <h2>狗來富，貓來起大厝</h2>
      <div class="kind">
        <div class="dog" :class="{active: dogStatus}" @click="dogPress">
          <span class="emoji">🐶</span><span class="animal">狗勾</span>
          <div class="switch">
            <div class="ball"></div>
          </div>
        </div>
        <div class="cat" :class="{active: catStatus}" @click="catPress">
          <span class="emoji">🐱</span><span class="animal">貓咪</span>
          <div class="switch">
            <div class="ball"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loadingCompleted && !apiErr"> 
      <!-- <div class="cards" :class="{toLeft:slideToLeft, toRight:slideToRight, slideMoving:isSliding}"> -->
      <div class="cards" :class="{toLeft:slideToLeft, toRight:slideToRight}">
        <div v-for="item in fiveData" class="card"
          @touchstart="touchstartHandler"
          @touchend="touchendHandler(slideEnd, $event)"
          :style="getBackground(item.album_file, item.defaultBackground)"
          :key="item.animal_id">
          <i class="fa-solid fa-crop" @click="imageMode=imageMode=='cover'?'contain':'cover'"></i>
        </div>
      </div>
      <!-- @touchmove="touchmoveHandler(slideMoving, $event)" -->
      <!-- :style="getBackground(item.album_file)" -->
      <div class="buttons">
        <div @click="slideEnd('left')" class="toLeft button"><i class="fa-regular fa-face-sad-tear"></i></div>
        <div @click="slideEnd('right')" class="toRight button"><i class="fa-solid fa-heart fa-beat-fade"></i></div>
      </div>
  
      <Transition name="slide" @after-enter="heartAni=false" mode="out-in">
        <i v-if="heartAni" class="heartAni fa-solid fa-heart"></i>
      </Transition>
    </div>

    <div v-else-if="apiErr" class="apiErr">
      <p>API似乎掛了‼</p>
      <p>😥請稍後再試😥</p>
    </div>
    <div v-else class="loading">
      <div class="message">配對中...</div>
      <div class="rectangles">
        <div class="rectangle"></div><div class="rectangle"></div><div class="rectangle"></div>
      </div>
    </div>
    <favorPetTemp :favor-pet="favorPet" 
                  :favor-pet-wrap-hide="favorPetWrapHide"
                  :image-mode="imageMode" 
                  @change-favor-pet-status="favorPetWrapHide=!favorPetWrapHide"
                  @change-favor-pet-up="favorPetWrapHide=false"
                  @change-favor-pet-down="favorPetWrapHide=true"
                  @delete-favorPet="deleteFavorPetHandler"
    />
  </div>
</template>

<style lang='scss' scoped>
@mixin mobile{
  @media(max-width: 768px){
    @content;
  }
}
@mixin flex_center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.button{
  display: flex;
  justify-content: center;
}
.wrap{
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(184,241,247,1) 0%, rgba(201,254,182,1) 100%);
  @include flex_center;
  position: relative;
  .option{
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    @include flex_center;
    flex-direction: column;
    @include mobile{
      top: 20px;
    }
    h2{
      color: rgba(255, 255, 255, 0.9);
      font-size: 5vw;
      @include mobile{
        font-size: 9vw;
      }
    }
    .kind{
      z-index: 99;
      @include flex_center;
      font-size: 6vmin;
      @include mobile{
        font-size: 9vw;
      }
      .dog, .cat{
        color: rgba(255, 255, 255, 0.9);
        margin: 0 10px;
        cursor: pointer;
        transition: all .5s;
        white-space: nowrap;
        transform: scale(0.9);
        transition: all .3s;
        &:hover{
          transform: scale(1);
        }
        @include flex_center;
        .emoji{
            opacity: 0.5;
            transform: scale(0.9);
            transition: all .3s;
        }
        .switch{
          position: relative;
          width: 8vmin;
          height: 4vmin;
          border-radius: 50px;
          padding: 0 5px;
          background: rgba(180, 180, 180, 0.5);
          transition: all .5s;
          @include mobile{
            width: 12vw;
            height: 6vw;
          }
          .ball{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            transform: translateX(80%);
            background: rgb(255, 255, 255);
            width: 5vmin;
            height: 5vmin;
            border-radius: 50%;
            transition: all .5s;
            box-shadow: 12px 0 15px -10px black;
            @include mobile{
              transform: translateX(90%);
              width: 7.5vw;
              height: 7.5vw;
            }
          }
        }
        &.active{
          .emoji{
            opacity: 1;
            transform: scale(1);
          }
          .switch{
            background: rgba(92, 183, 85, 0.5);
            .ball{
              transform: translateX(0%);
            }
          }
        }
      }
    }
  }
  div{
    .cards{
      position: absolute;
      top: 50px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      .card{
        position: absolute;
        top: 120px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 50vmin;
        height: 50vmin;
        border-radius: 20px;
        @include mobile{
          top: 0;
          width: 90vmin;
          height: 90vmin;
        }
        &:nth-child(1){
          transform: perspective(400px) translate3d(0, 0, 0);
          border: rgb(244, 253, 143) 5px solid;
          opacity: 1;
          z-index: 5;
        }
        &:nth-child(2){
          transform: perspective(300px) translate3d(0, -32px, -10px);
          border: rgb(244, 253, 143) 4px solid;
          opacity: 0.8;
          z-index: 4;
        }
        &:nth-child(3){
          transform: perspective(200px) translate3d(0, -65px, -20px);
          border: rgb(244, 253, 143) 3px solid;
          opacity: 0.6;
          z-index: 3;
        }
        &:nth-child(4){
          transform: perspective(150px) translate3d(0, -105px, -30px);
          border: rgb(244, 253, 143) 2px solid;
          opacity: 0.4;
          z-index: 2;
        }
        &:nth-child(5){
          transform: perspective(150px) translate3d(0, -105px, -30px);
          opacity: 0;
          z-index: 1;
        }
        i.fa-crop{
          position: absolute;
          right: 10px;
          bottom: 10px;
          font-size: 16px;
          color: rgb(215, 124, 144);
          cursor: pointer;
        }
      }
      // &.slideMoving{
      //   .card{
      //     // will-change: transform;
      //     // transition: transform .2s;
      //     &:nth-child(1){
      //       // transform: perspective(400px) translate3d(v-bind(moveX)+'px',v-bind(moveY)+'px', 0);
      //       transform: v-bind(moveX);
      //     }
      //   }
      // }
      &.toLeft, &.toRight{
        .card{
          will-change: transform;
          transition: transform .2s;
          &:nth-child(1){
            transform: perspective(400px) translate3d(-70vw, 0, 0) rotate(-10deg);
            opacity: 0.3;
          }
          &:nth-child(2){
            border: rgb(244, 253, 143) 5px solid;
            transform: perspective(400px) translate3d(0, 0, 0);
            opacity: 1;
          }
          &:nth-child(3){
            transform: perspective(300px) translate3d(0, -32px, -10px);
            opacity: 0.8;
          }
          &:nth-child(4){
            transform: perspective(200px) translate3d(0, -65px, -20px);
            opacity: 0.6;
          }
          &:nth-child(5){
            transform: perspective(150px) translate3d(0, -105px, -30px);
            opacity: 0.4;
          }
        }
      }
      &.toRight{
        .card{
          &:nth-child(1){
            transform: perspective(400px) translate3d(70vw, 0, 0) rotate(10deg);
            opacity: 0.3;
          }
        }
      }  
    }
    .buttons{
      position: absolute;
      left: 0;
      right: 0;
      padding: 0 60px;
      display: flex;
      justify-content: space-between;
      @include mobile{
        bottom: 60px
      }
      .button{
        @include flex_center;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(244,253,143,1) 0%, rgba(244,253,143,0.6) 100%);
        border-radius: 50%;
        transform: scale(0.8);
        transition: all .3s;
        cursor: pointer;
        &:hover{
          transform: scale(1);
          background: radial-gradient(circle, rgba(244,253,143) 0%, rgba(244,253,143) 100%);
        }
        @include mobile{
          height: 50px;
          border-radius: 30px;
        }
        i {
          color: rgb(215, 124, 144);
          font-size:60px;
          @include mobile{
            font-size: 40px;
          }
        }
      }
    }
    .heartAni{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      @include flex_center;
      margin: auto;
      z-index: 99;
      font-size: 30px;
      color: rgb(215, 124, 144);
    }
  }
}
.apiErr{
  font-size: 8vw;
  color: rgb(131, 74, 5);
  @include flex_center;
  flex-direction: column;
}
.loading{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  @include flex_center;
  flex-direction: column-reverse;
  transition: all 1s;
  .message{
    font-size: 22px;
    color: #ffffff;
  }
  .rectangles{
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    .rectangle{
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      background: #ffffff;
      animation: loadingAnimation .5s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      &:nth-child(1){
        left: 8px;
        animation-delay: -0.24s;
      }
      &:nth-child(2){
        left: 32px;
        animation-delay: -0.12s;
      }
      &:nth-child(3){
        left: 56px;
        animation-delay: 0;
      }
    }
    @keyframes loadingAnimation{
      0% { top: 8px;  height: 64px; }
      50%, 100% { top: 24px; height: 32px; }
    }
  }
}
.slide-enter-active{
  transition: all .3s linear;
}
.slide-enter-from {
  opacity: 1;
}
.slide-enter-to, .slide-leave-to, .slide-leave-from{
  opacity: 0;
  transform: scale(6);
}
</style>