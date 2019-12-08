<template>
  <div>
    <div
      class="card__col-left"
      :class="{ 'card__col-left--section': field.section }"
    >
      <label
        class="truncate"
        :class="{ 'visibility-hidden opacity-0': isDisabled }"
        :title="$t(`label.${templateName}.${field.label || key}`)"
      >
        {{ $t(`label.${templateName}.${field.label || key}`) }}
      </label>
      <TextField
        :disabled="isDisabled"
        :value="item.template && item.template[key]"
        :placeholder="(item.template && item.template[key]) || $t(`placeholder.${templateName}.${field.placeholder || key}`)"
        squared
        right
        hide-details
        class="pt-0 partner-card__label"
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
          class="partner-card__input"
          @input="(v) => $emit('update-value', key, v)"
        />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'TemplateCardItem',
  props: {
    templateName: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    field: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
