<template>
  <div id="app">
    <Spec/>
  </div>
</template>

<script>
import Spec from './components/Spec'

export default {
  components: {
    Spec,
  },
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
