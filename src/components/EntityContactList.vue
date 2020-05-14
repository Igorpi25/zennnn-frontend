<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest" @click="toggleExpand">
        Дополнительные способы связи
      </div>
      <div>
        <button
          class="w-6 h-6 flex items-center justify-center text-xl text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none select-none"
           @click="toggleExpand"
        >
          <i v-if="expanded" class="zi-chevron-down" />
          <i v-else class="zi-chevron-up" />
        </button>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="expanded">
        <div
          v-if="items.length > 0"
          class="pb-10">
          <div>
          </div>
        </div>
        <div class="pt-10 w-1/2">
          <Button
            block
            outlined
            class="h-10 text-sm pr-6"
          >
            Добавить способ связи
          </Button>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'EntityContactList',
  data () {
    return {
      items: [],
      expanded: true,
    }
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
