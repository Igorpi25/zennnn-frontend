<template>
  <div class="copyright">
    <div>©2019 ZENNNN Corp. All Rights Reserved. Privacy Policy</div>
    <span class="text-gray-dark">
      <span>Frontend: {{ frontendVersion }}</span>
      <template v-if="backendVersion">
        &nbsp; | &nbsp;
        <span>Backend: {{ backendVersion }}</span>
      </template>
    </span>
  </div>
</template>

<script>
import { GET_BACKEND_VERSION } from '../graphql/queries'

export default {
  name: 'Copyright',
  apollo: {
    backendVersion: {
      query: GET_BACKEND_VERSION,
    },
  },
  data () {
    return {
      frontendVersion: process.env.FRONTEND_VERSION || '',
    }
  },
}
</script>
