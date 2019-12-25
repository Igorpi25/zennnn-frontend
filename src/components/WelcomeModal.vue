<template>
  <div class="modal">
    <div class="modal-header">
      <!-- <Icon size="28">{{ icons.ziAlert }}</Icon> -->
      <div style="width:28px; height:28px; background-color:#aaa; color:#000"></div>
      <span class="ml-3">
        Добро пожаловать в zennnn
      </span>
    </div>
    <div class="modal-body text-center text-sm sm:text-left sm:text-base">
        <p>Круто, что ты зарегистрировался в zennnn!</p>
        <br>
        <p>
          Для продолжения работы мы рекомендуем заполнить реквизиты
          твоей компании, они пригодятся, когда нужно будет автоматически
          подготовить какие-либо документы.
        </p>
        <br>
        <p>
          Этот шаг можно пропустить. В будущем реквизиты компании можно
          будет заполнить в разделе
          «<router-link
            :to="{name: 'home'}"
            class="text-primary"
            >Мои компании</router-link>»
           в главном меню.
        </p>
        <Button
          large
          class="mt-10 mb-4 mx-auto"
          @click="$emit('close')"
        >
          <span>Заполнить реквизиты</span>
        </Button>
      </div>
      <span class="close-btn" @click="$emit('close')">
      <Icon>{{ icons.mdiClose }}</Icon>
    </span>
  </div>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: 'WelcomeModal',
  data () {
    return {
      icons: {
        mdiClose,
      },
    }
  },
}
</script>

<style lang="postcss" scoped>
  .modal {
    position: relative;
    @apply bg-gray text-lg;
  }
  .modal-header {
    padding: 15px;
    display: flex;
    align-items: center;
    color: #aaaaaa;
    @apply bg-gray-darkest;
  }
  .modal-body {
    padding: 20px;
    color: #aaaaaa;
  }
  @screen sm {
    .modal-header {padding: 25px;}
    .modal-body {padding: 30px 40px;}
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    color: #fff;
    cursor: pointer;
  }
</style>
