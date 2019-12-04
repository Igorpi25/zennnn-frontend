<template>
  <div class="container">
    <div class="py-12">
      <TemplateCard
        :template-name="client"
        :fields="legalFieldsSettings"
        :item="item"
      >
      </TemplateCard>
    </div>
  </div>
</template>

<script>
import TemplateCard from '../components/TemplateCard.vue'

export default {
  name: 'Requisites',
  components: {
    TemplateCard,
  },
  data () {
    return {
      legalFieldsSettings: {
        companyName: {},
        companyNameEn: {},
      },
      item: {
        bla: 'bla',
      },
    }
  },
}
</script>

<style>

</style>
