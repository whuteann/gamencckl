import {
  FieldProps,
} from "formik";

export interface FormikErrorMessageProps {
  id?: string;
  name: string;
  component?: string | React.ComponentType<FieldProps>;
  render?: (error: string) => React.ReactNode;
}