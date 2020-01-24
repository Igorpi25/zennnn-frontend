<template>
  <div class="modal">
    <div class="modal-body">
      <span class="ml-3">{{ heading }}</span>
      <div class="message-list">
        <div
          v-for="message in messages"
          :key="message"
          class="message-list__message"
        >
          <div>{{ message }}</div>
          <div class="mt-1 text-gray-lightest text-sm italic"> — {{ client }}</div>
        </div>
      </div>
      <TextArea
        v-model="message"
        hide-details
        has-focus
        auto-glow
        squared
        rows="7"
        class="mt-10"
      />
    </div>
    <Button
      large
      class="mb-4 mx-auto"
      @click="$emit('save', message)"
    >
      <span>{{ $t('action.save') }}</span>
    </Button>
    <span class="close-btn" @click="$emit('close')">
      &times;
    </span>
  </div>
</template>

<script>
export default {
  name: 'PreviewMessageModal',
  props: {
    heading: {
      type: String,
      default: '',
    },
    client: {
      type: String,
      default: '',
    },
    isNote: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      message: '',
      messages: [],
    }
  },
  created () {
    this.isNote
      ? this.messages = JSON.parse(localStorage.getItem('notes')) || []
      : this.messages = JSON.parse(localStorage.getItem('comments')) || []
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    display: flex;
    flex-direction: column;
    position: relative;
    @apply bg-gray;
  }
  .modal-body {
    min-height: 340;
    padding: 20px;
    overflow-y: auto;
    color: #CDCDCD;
  }
  .message-list {
    margin-top: 30px;
    max-height: 200px;
    overflow-y: scroll;
  }
  .message-list__message {
    @apply mb-2 p-1;
    border: 1px solid #4b4b4b;
    border-radius: 4px;
    cursor: pointer;
  }
  .modal-body__message-list--full {
    transition: .5s;
    overflow: visible;
    white-space: normal;
  }
  .close-btn {
    position: absolute;
    top: 5px;
    right: 15px;
    color: #fff;
    cursor: pointer;
  }
</style>
