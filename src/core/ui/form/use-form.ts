'use client'

import { createFormHook } from '@tanstack/react-form'

import {
  FormCheckboxField,
  FormComboboxField,
  FormDatePickerField,
  FormFileUploadField,
  FormMultiSelectField,
  FormNumberField,
  FormRadioGroupField,
  FormSelectField,
  FormSliderField,
  FormSwitchField,
  FormTextareaField,
  FormTextField,
  FormMonacoField,
} from './fields'
import { FormSubscribeButton } from './form-subscribe-button'
import { fieldContext, formContext } from './form.context'

/**
 * Hook principal para crear formularios con TanStack Form.
 * Los componentes de campo se mapean sin prefijo en fieldComponents para facilitar el uso.
 */
export const { useAppForm: useForm } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
    TextareaField: FormTextareaField,
    SelectField: FormSelectField,
    CheckboxField: FormCheckboxField,
    SwitchField: FormSwitchField,
    RadioGroupField: FormRadioGroupField,
    NumberField: FormNumberField,
    DatePickerField: FormDatePickerField,
    SliderField: FormSliderField,
    ComboboxField: FormComboboxField,
    MultiSelectField: FormMultiSelectField,
    FileUploadField: FormFileUploadField,
    MonacoField: FormMonacoField,
  },
  formComponents: {
    SubscribeButton: FormSubscribeButton,
  },
  fieldContext,
  formContext,
})
