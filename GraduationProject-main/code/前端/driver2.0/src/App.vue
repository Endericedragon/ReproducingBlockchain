<template>
  <div id="app">
     <router-view ></router-view>
  </div>
</template>

<script>
import mapContent from "./components/map.vue";

export default {
  name: "App",
  components: {
    mapContent,
  },
};
</script>

<style>
</style>
