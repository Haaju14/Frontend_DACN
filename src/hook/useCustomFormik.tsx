// src/hooks/useCustomFormik.ts
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";

interface FormValues {
  [key: string]: any;
}

const useCustomFormik = <T extends FormValues>(
  initialValues: T,
  validationSchema: Yup.ObjectSchema<T>,
  onSubmit: (values: T) => void
): FormikProps<T> => {
  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return formik;
};

export default useCustomFormik;
