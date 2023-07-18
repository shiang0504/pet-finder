<script setup>
import { ref, computed, watch, watchEffect} from 'vue'
import { touchstartHandler, touchendHandler } from '../JS/touch'


const props = defineProps({
  favorPet: Array,
  favorPetWrapHide: Boolean,
  imageMode: String,
})
const Emits = defineEmits(['change-favor-pet-status','change-favor-pet-up','change-favor-pet-down','delete-favorPet'])

const slide = (direction)=>{
  if(direction==='up'){
    Emits('change-favor-pet-up')
  }else if(direction==='down'){
    Emits('change-favor-pet-down')
  }
}

//整理props資料 並加上想要的欄位
const favorPetData = ref([])
watchEffect(()=>{
  favorPetData.value = props.favorPet.map(pet=>{
    if(pet.animal_Variety.trim()==='混種狗' || pet.animal_Variety.trim()==='混種犬') pet.animal_Variety='米克斯狗狗';
    if(pet.animal_Variety.trim()==='混種貓') pet.animal_Variety='米克斯貓咪';
    pet.animal_sex=pet.animal_sex.trim()==='M'?'小男生':'小女生'
    pet.animal_sterilization = pet.animal_sterilization.trim()==='T'?'已經絕育了':'還沒絕育'
    // 把 "2023-07-16" 字串切割 不想更改原資料 所以創新變數
    const [year,month,date] = pet.animal_opendate.split('-')
    const animal_opendateTrans = `${year}年${month}月${date}日`
    return {
      ...pet,
      animal_opendateTrans: animal_opendateTrans,
      status : false,
    }
  })
})

// console.log('子組件拿到props.favorPetWrapHide',props.favorPetWrapHide)
// console.log('子組件拿到props.favorPet',props.favorPet)
// console.log('子組件拿到favorPetData.value',favorPetData.value)

const getBackground = (url)=>{
  return `background: #a9e6cc url(${url}) no-repeat center / ${props.imageMode}`
}

const flip=(pet)=>{
  favorPetData.value.forEach(i=>i.status=false);
  pet.status=!pet.status
}

</script>

<template>
  <div class="favorPetWrap" :class="{hide:props.favorPetWrapHide}" @touchstart.self="touchstartHandler" @touchend.self="touchendHandler(slide, $event)">
    <div class="favorPetWrapToggle" @click="$emit('change-favor-pet-status')">
      <i class="fa-solid fa-paw">{{ favorPetData.length }}</i>
    </div>
    <!-- <div class="cards"> -->
    <TransitionGroup name="delete" tag="div" class="cards">
      <div v-for="pet in favorPetData" class="card-container" @click="flip(pet)" :class="{flip:pet.status}" :key="pet.animal_id">
        <div class="card-front" :style="getBackground(pet.album_file)" @touchstart.self="touchstartHandler" @touchend.self="touchendHandler(slide, $event)"></div>
        <div class="card-back">
          <div class="info">
            <div class="back" @click.stop="pet.status=false"><i class="fa-solid fa-arrow-rotate-left"></i></div>
            <div class="delete" @click.stop="$emit('delete-favorPet',pet.animal_id)"><i class="fa-regular fa-trash-can"></i></div>
            <p>
              <span>Hi，我是</span><span class="highLight">{{ pet.animal_Variety }}</span>
              <span>，編號是</span><span class="highLight">{{ pet.animal_id }}</span>
              <span>，我是</span><span class="highLight">{{ pet.animal_sex }}</span>
              <span>，我現在住在</span><span class="highLight">{{ pet.shelter_name }}</span>
              <span>，地址是</span><span class="highLight">{{ pet.shelter_address }}</span>
              <span>，這邊的連絡電話是</span><span class="highLight">{{ pet.shelter_tel }}</span>
              <span>，我</span><span class="highLight">{{ pet.animal_sterilization }}</span>
              <span>，從</span><span class="highLight">{{ pet.animal_opendateTrans }}</span><span>開始找新家喔!</span>
            </p>
            <p v-if="pet.animal_remark"><span>偷偷跟你說，我看到收容所的叔叔阿姨備註：</span><span class="highLight">{{ pet.animal_remark }}</span></p>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <!-- </div> -->
  </div>
</template>

<style scoped lang="scss">
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
.favorPetWrap{
  position: absolute;
  width: 100%;
  height: 70vh;
  bottom: 0;
  background: linear-gradient( 0deg, rgb(228, 183, 189) 50.8%, rgb(157, 218, 213, 0.1) 100% );
  // border-radius: 20px 20px 0 0;
  box-shadow: 0 10px 20px black;
  backdrop-filter: blur(5px);
  z-index: 100;
  will-change: transform;
  transition: all .5s;
  @include mobile{
    background: linear-gradient( 0deg, rgb(228, 183, 189) 7.8%, rgb(157, 218, 213) 100% );
  }
  .favorPetWrapToggle{
    position: absolute;
    width: 100%;
    height: 40px;
    @include flex_center;
    top: -40px;
    background: rgb(244, 253, 143);
    box-shadow: 0 -10px 10px -10px black;
    border-radius: 30px 30px 0 0;
    cursor: pointer;
    i{
      font-size: 30px;
      color: rgb(215, 124, 144);
      position: relative;
    }
  }
  .cards{
    box-sizing: border-box;
    height: 100%;
    padding: 100px 50px 50px 50px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: auto; // 取消body設定hihe
    perspective: 1200px;
    pointer-events: none; //透過父層去觸發favorPetWrap
    position: relative;
    @include mobile{
      flex-wrap: nowrap;
      align-items: center;
      scroll-snap-type: x mandatory
    }
    .card-container{
      flex: 1 0 300px;
      margin: 10px;
      position: relative;
      height: 300px;
      cursor: pointer;
      pointer-events: auto; //不繼承父層設定
      @include mobile{
        scroll-snap-align: center;
      }
      .card-front, .card-back{
        width: 100%;
        height: 100%;
        border-radius: 20px;
        position: absolute;
        backface-visibility: hidden;
      }
      .card-front{
        background: #ccc url(../assets/dog-2.jpg) no-repeat center / cover;
        animation: rotate-reverse 0.25s ease-in-out forwards;
      }
      .card-back{
        // background-image: linear-gradient(180deg,rgba(245,116,185,0.5) 14.7%,rgba(89,97,223,0.5) 88.7% );
        background: url(../assets/backgroundImage.png);
        animation: rotate2 0.25s ease-in-out forwards;
        box-sizing: border-box;
        padding: 30px;
        word-wrap: break-word; //設定斷行就不會超出x軸
        overflow-y: hidden; //電腦版設auto垂直卷軸會卡住 所以翻過來再改auto
        &::-webkit-scrollbar { //隱藏滾動條
          width: 14px;
          color: transparent;
        }

        @include mobile{
          overflow-y: auto; //手機版設hidden會讓水平卷軸整個卡住
        }
        .info{
          font-size: 22px;
          line-height: 36px;
          font-weight: 600;
          position: relative;
          .back{
            position: absolute;
            top: -25px;
            left: -15px;
          }
          .delete{
            position: absolute;
            top: -25px;
            right: -15px;
            transition: all .3s;
            &:hover{
              color: red;
            }
          }
          p{
            margin-bottom: 20px;
          }
          .highLight{
            color: rgb(215, 124, 144);
            font-weight: 900;
          }
          
        }
      }
      &.flip {
        .card-front{
          animation: rotate 0.25s ease-in-out forwards;
        }
        .card-back{
          animation: rotate2-reverse 0.25s ease-in-out forwards;
          overflow-y: auto;
        }
      }
    }
  }
  &.hide{
    transform: translateY(100%);
    // .cards{
      // overflow: hidden;
    // }
  }
  @keyframes rotate{
    0%{transform: rotateY(0deg);}
    80%{transform: rotateY(200deg);}
    100%{transform: rotateY(180deg);}
  }
  @keyframes rotate-reverse{
    0%{transform: rotateY(180deg);}
    80%{transform: rotateY(-20deg);}
    100%{transform: rotateY(0deg);}
  }
  @keyframes rotate2{
    0%{transform: rotateY(0deg);}
    80%{transform: rotateY(-200deg);}
    100%{transform: rotateY(-180deg);}
  }
  @keyframes rotate2-reverse{
    0%{transform: rotateY(-180deg);}
    80%{transform: rotateY(20deg);}
    100%{transform: rotateY(0deg);}
  }
}
.delete-move, .delete-enter-active, .delete-leave-active {
  transition: all .2s linear;
}
.delete-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.delete-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.delete-leave-active {
  position: absolute;
}
</style>