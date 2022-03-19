import axios from "axios";

export async function getAllProducts() {
  return await axios.get('/product/all')
    .then(function (response) {
      // handle success
      return response?.data;
    })
    .catch(function (error) {
      // handle error
      return null;
    })
};