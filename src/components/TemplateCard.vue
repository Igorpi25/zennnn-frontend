<template>
  <div class="card">
    <span class="card__title">
      {{ title }}
      <slot name="prepand" />
    </span>
    <slot name="items" :items="fields">
      <div
        :class="[
          'card__section',
          { 'card__section--faded': isDisabled }
        ]"
      >
        <div
          class="card__row"
          v-for="(field, key) in fields"
          :key="key"
        >

          <slot
            :name="`${key}-row`"
            :item="field"
          >
            <div
              class="card__col-left"
              :class="{ 'card__col-left--section': field.section }"
            >
              <label
                class="truncate"
                :class="{ 'visibility-hidden opacity-0': isDisabled }"
                :title="$t(`label.${templateName}.${key}`)"
              >
                {{ $t(`label.${templateName}.${key}`) }}
              </label>
              <TextField
                :disabled="isDisabled"
                :value="item.template[key]"
                :placeholder="item.template[key] || $t(`placeholder.${templateName}.${field.placeholder || key}`)"
                squared
                right
                hide-details
                class="pt-0 template-card__label"
                @input="$emit('update-template', key, $event)"
              />
            </div>
            <slot
              :name="key"
              :field="item[key]"
            >
              <div
                class="card__col-right relative"
                :class="{ 'card__col-right--section': field.section }"
              >
                <span class="card__subtitle">
                  {{ field.subtitle ? $t(`${templateName}.${field.subtitle}`) : '' }}
                </span>
                <label :class="{ 'visibility-hidden opacity-0': isDisabled }">
                  <span
                    v-if="field.label"
                    v-html="$t(`label.${templateName}.${field.label}`)"
                  />
                </label>
                <TextArea
                  :rows="field.rows || 1"
                  :disabled="isDisabled"
                  :value="item[key]"
                  squared
                  hide-details
                  class="template-card__input"
                  @input="(v) => $emit('update-value', key, v)"
                />
              </div>
            </slot>
          </slot>

        </div>
      </div>
    </slot>
    <slot name="apend" />
  </div>
</template>

<script>
export default {
  name: 'TemplateCard',
  props: {
    title: {
      type: [String, Object],
      default: '',
    },
    templateName: {
      type: [String, Object],
      default: '',
    },
    fields: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.card {
  width: 100%;
  @apply bg-chaos-black;
  padding: 20px 0 25px;
}
.card__title {
  display: none;
}
.card__subtitle {
  position: absolute;
  top: -55px;
  left: 0;
  color: #9F9F9F;
  letter-spacing: 0.03em;
  font-size: 16px;
  line-height: 135%;
  font-weight: 600;
}
.card__section {
  margin-bottom: 60px;
}
.card__section--faded {
  /* opacity: 0.4; */
}
.card__row {
 display: flex;
 flex-direction: column;
 justify-content: space-between;

}
.card__col-left  label, .card__col-right  label {
  display: none
}
.card__col-left  input, .card__col-right  input {
  width: 100%;
  display: block;
  @apply px-2 border border-gray;
}
.card__col-left {
  margin-bottom: 3px;
  text-align: right;
  white-space: nowrap;
}
.card__col-right {
  width: 100%;
  margin-bottom: 30px;
}
.card__col-left.card__col-left--full-width label {
  display: block;
  height: 20px;
  color: #2E2E2E;
  @apply px-2 text-sm;
}
.card__col-left--shops {

}
.card__col-left--section {
  margin-top: 60px;
}
.card__col-right--section {
  margin-top: 0;
}
@screen sm {
  .card {
    padding: 20px 30px 25px;
  }
}
@screen md {
  .card__title {
    display: block;
    text-align: center;
    margin-bottom: 30px;
  }
}

@screen lg {
  .card {
    width: calc(50% - 2px);
    padding-top: 60px;
  }
  .card__subtitle {
    top: -30px;
  }
  .card__row {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card__col-left  label, .card__col-right  label {
    display: block;
    height: 20px;
    color: #2E2E2E;
    @apply px-2 text-sm;
  }
  .card__col-left {
    width: calc(45% - 2px);
    margin-bottom: 0;
  }
  .card__col-right {
    width: calc(55% - 2px);
    margin-bottom: 0;
  }
  .card__col-left--shops {
    width: 40%;
    padding-right: 4px;
    margin-left: auto;
    text-align: right;
  }
  .card__col-left.card__col-left--full-width {
    width: 100%;
  }
  .card__col-left--section {
    margin-top: 60px;
  }
  .card__col-right--section {
    margin-top: 60px;
  }
}
</style>

<style>
.template-card__label.text-field--focused input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #2A2B2D!important;
}
.template-card__label.text-field--focused input::-moz-placeholder { /* Firefox 19+ */
  color: #2A2B2D!important;
}
.template-card__label.text-field--focused input:-ms-input-placeholder { /* IE 10+ */
  color: #2A2B2D!important;
}
.template-card__label.text-field--focused input:-moz-placeholder { /* Firefox 18- */
  color: #2A2B2D!important;
}
.template-card__label.text-field.is-disabled .text-field__slot,
.template-card__label.text-area.is-disabled .text-area__slot,
.template-card__input.text-field.is-disabled .text-field__slot,
.template-card__input.text-area.is-disabled .text-area__slot {
  border: none!important;
}
</style>
