<template>
  <div class="copyright">
    <div>©2019 Zennnn Corp. All Rights Reserved. Privacy Policy</div>
    <span>Frontend: {{ frontend }}</span>
    &nbsp; | &nbsp;
    <span>Backend: {{ backend }}</span>
  </div>
</template>

<script>
export default {
  name: 'Copyright',
  data () {
    return {
      frontend: 'ver 1.1.0-78 4c234a9',
      backend: 'ver 1.1.12-80 8ac4cbc',
    }
  },
  mounted () {
    // this.frontend = process.env.FRONTEND_VERSION
  },
}
</script>
