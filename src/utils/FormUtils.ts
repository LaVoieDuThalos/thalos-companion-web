export type ValidationErrors = Record<string, boolean>;

export type FormState = {
  submitted: boolean;
};

export type CustomFormProps<TFormData> = {
  errors?: ValidationErrors;
  state?: FormState;
  onChange: (formData: TFormData) => void;
  formData: TFormData;
  disabled?: boolean;
};

export function hasError(
  errors: ValidationErrors | undefined,
  error: string
): boolean {
  return !!errors && errors && !!errors[error];
}

export function isFormValid(errors: ValidationErrors): boolean {
  return !errors || Object.keys(errors).every((e) => !errors[e]);
}

export const Validators = {
  isNotEmpty: (value: string) => {
    return !!value && value.trim() !== '';
  },

  max: (value: string, maxValue: number) => {
    return !!value && value.trim().length > maxValue;
  },

  min: (value: string, minValue: number) => {
    return !!value && value.trim().length < minValue;
  },

  allowedCharacters: (
    value: string,
    pattern: RegExp = /^[a-zA-Z0-9_@#*\W ]+$/
  ) => {
    return !!value && pattern.test(value.trim());
  },

  dateIsPassed: (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return !!date && date.getTime() < yesterday.getTime();
  },

  notStartsWith: (testValue: string | undefined, value: string) => {
    if (!testValue) {
      return false;
    }
    return !testValue.startsWith(value);
  },
};
