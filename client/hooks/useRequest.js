import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, data, onSuccess }) => {
  const [errors, setErrors] = useState([]);
  async function doRequest() {
    try {
      const response = await axios.request({ url, method, data });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  }

  return { errors, doRequest };
};
