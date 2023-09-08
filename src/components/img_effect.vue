<script setup>
import { ref, onMounted } from 'vue';

const domA = ref(null)
const show = ref(false)
onMounted(()=>{
  function onEnterView(el, observer) {
    if (el[0].isIntersecting) {
      show.value=true
      observer.unobserve(el[0].target);
    }
  }
  const watcher = new IntersectionObserver(onEnterView);
  watcher.observe(domA.value);
})



</script>

<template>
  <div class="imgEffectWrap" ref="domA" :class="{ active: show }">
    <slot>
      <!-- <img data-src="https://picsum.photos/300/200?random=2" src="" v-lazyloading> -->
    </slot>
    <div class="colorMask1"></div>
    <div class="colorMask2"></div>
  </div>
</template>

<style lang="scss">
.imgEffectWrap{
  position: relative;
  overflow: hidden;
  img{
    opacity: 0;
    transition: opacity 0s cubic-bezier(0, 0, 0, 0.99) 1s;
  }
  .colorMask1{
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: rgb(244, 253, 143);
    transition: width 1s cubic-bezier(0, 0, 0, 0.99),
                transform 0.9s cubic-bezier(0, 0, 0, 0.99) 1.1s,
                opacity 0.1s cubic-bezier(0, 0, 0, 0.99) 2s;
  }
  .colorMask2{
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    // background: url(./assets/vue.svg);
    background: rgb(215, 124, 144);
    transition: width 0.9s cubic-bezier(0, 0, 0, 0.99) 0.1s,
                transform 0.9s cubic-bezier(0, 0, 0, 0.99) 1s,
                opacity 0.1s cubic-bezier(0, 0, 0, 0.99) 2s;
  }
  &.active{
    img{
      opacity: 1;
    }
    .colorMask1{
      width: 100%;
      transform: translateX(100%);
      opacity: 0;
    }
    .colorMask2{
      width: 100%;
      transform: translateX(100%);
      opacity: 0;
    }
  }
}
</style>

<!-- 用<imgEffect></imgEffect>標籤把img包起來 -->
<!-- 即會套用進入畫面色塊遮罩轉場的效果 -->