import { useState } from "react";

const useForm = (initialValue, callback) => {
     const [formData, setFormData] = useState(initialValue);

     const changeHandler = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const clearData = () => setFormData(initialValue);

     const submitHandler = (e) => {
          e.preventDefault();

          callback();
     };

     return { formData, changeHandler, submitHandler, clearData };
};

export default useForm;
