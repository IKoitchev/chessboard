import { FunctionComponent } from "react";
import "../../index.css";

interface InputFieldProps {
  [key: string]: string;
}

const InputField: FunctionComponent<InputFieldProps> = (props) => {
  return (
    <>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        {...props}
        required={Boolean(props.required)}
        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
    </>
  );
};

export default InputField;
