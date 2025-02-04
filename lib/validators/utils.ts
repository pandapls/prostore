import { ControllerRenderProps, Path } from 'react-hook-form';

export type FieldProps<TFormData, TFieldName extends Path<TFormData>> = {
	field: ControllerRenderProps<TFormData, TFieldName>;
};
