<template>
  <div class="card">
    <span class="hidden text-center pb-8 md:block">
      {{ title }}
      <slot name="prepend" />
    </span>
    <slot name="items" :items="fields">
      <div
        :class="[
          'pb-16',
          { 'card__section--faded': isNotActive }
        ]"
      >
        <template
          v-for="(field, key) in fields"
        >
          <div
            v-if="field.section"
            class="flex justify-center pt-16"
            :key="`section-${key}`"
          >
            <div
              v-if="field.subtitle"
              class="text-gray-lightest px-2 pb-4 text-center text-base font-semibold leading-snug tracking-wide"
            >
              {{ $t(`${templateName}.${field.subtitle}`) }}
            </div>
          </div>
          <div
            class="flex flex-col justify-between pb-8 lg:flex-row lg:flex-wrap lg:pb-0"
            :key="key"
          >

            <slot
              :name="`${key}-row`"
              :item="field"
            >
              <div
                class="card__col-left"
              >
                <div v-if="field.labelReadonly" class="text-gray-dark text-left lg:text-right px-2">
                  {{ $t(`${templateName}.placeholder.${field.label || key}`) }}
                </div>
                <div v-else>
                  <label
                    class="truncate"
                    :class="{ 'visibility-hidden opacity-0': isDisabled }"
                    :title="$t(`${templateName}.label.${field.label || key}`)"
                  >
                    {{ $t(`${templateName}.label.${field.label || key}`) }}
                  </label>
                  <TextField
                    :disabled="isDisabled"
                    :value="item.template && item.template[key]"
                    :placeholder="(item.template && item.template[key]) || $t(`${templateName}.placeholder.${field.placeholder || key}`)"
                    squared
                    hide-details
                    class="pt-0 template-card__label"
                    input-class="text-gray-300 focus:text-white placeholder-gray-300"
                    @input="$emit('update-template', key, $event)"
                  />
                </div>
              </div>
              <slot
                :name="key"
                :field="item[key]"
              >
                <div
                  class="card__col-right relative"
                >
                  <label :class="{ 'visibility-hidden opacity-0': isDisabled }">
                    <span
                      v-if="field.inputLabel"
                      v-html="$t(`${templateName}.label.${field.inputLabel}`)"
                    />
                  </label>
                  <TextArea
                    :ref="field.ref || null"
                    :rows="field.rows || 1"
                    :disabled="field.disabled || isDisabled"
                    :value="item[field.defaultValueKey] || item[key]"
                    :placeholder="isDisabled ? '-' : null"
                    :rules="field.rules"
                    squared
                    hide-details
                    class="template-card__input"
                    @input="(v) => $emit('update-value', key, v)"
                  />
                </div>
              </slot>
              <div
                v-if="field.labelHint"
                class="card__col-left pt-1 lg:pt-0"
              >
                <div
                  class="text-sm text-left lg:text-right leading-none whitespace-normal px-2"
                  style="color: #2E2E2E;"
                >
                  {{ $t(`${templateName}.${field.labelHint}`) }}
                </div>
              </div>
            </slot>

          </div>
        </template>
      </div>
    </slot>
    <slot name="append" />
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
    isNotActive: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.card {
  @apply w-full bg-chaos-black;
  padding: 20px 0 25px;
}
.card__section--faded {
  transition: opacity .15s cubic-bezier(.25,.8,.5,1);
  opacity: 0.4;
}
.card__col-left  label, .card__col-right  label {
  @apply hidden;
}
.card__col-left  input, .card__col-right  input {
  @apply block px-2 w-full border border-gray;
}
.card__col-left {
  @apply mb-1 text-right whitespace-no-wrap;
}
.card__col-right {
  @apply w-full;
}
.card__col-left.card__col-left--full-width label {
  color: #2E2E2E;
  @apply block px-2 text-sm h-5;
}
@screen sm {
  .card {
    padding: 20px 30px 25px;
  }
}

@screen lg {
  .card {
    width: calc(50% - 2px);
    @apply pb-16;
  }
  .card__col-left  label, .card__col-right  label {
    color: #2E2E2E;
    @apply block px-2 text-sm h-5;
  }
  .card__col-left {
    width: calc(45% - 2px);
    @apply mb-0;
  }
  .card__col-right {
    width: calc(55% - 2px);
  }
  .card__col-left--shops {
    @apply text-right ml-auto pr-1 w-2/5;
  }
  .card__col-left.card__col-left--full-width {
    @apply w-full;
  }
}
</style>

<style lang="postcss">
@screen lg {
  .template-card__label input {
    @apply text-right;
  }
}

.template-card__label.text-field input {
  color: #585858!important;
}
.template-card__label.text-field--focused input {
  color: #ffffff!important;
}

.template-card__label.text-field.is-disabled .text-field__slot,
.template-card__label.text-area.is-disabled .text-area__slot,
.template-card__input.text-field.is-disabled .text-field__slot,
.template-card__input.text-area.is-disabled .text-area__slot {
  border-color: transparent!important;
}
</style>
