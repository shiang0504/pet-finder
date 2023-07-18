<script setup>
import { ref } from 'vue'
// import HelloWorld from '../HelloWorld.vue'



defineProps({
  msg: String,
})

const count = ref(0)


// app.component('HelloWorld', HelloWorld)

</script>

<template>
  <h1>來自HelloWorld</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
