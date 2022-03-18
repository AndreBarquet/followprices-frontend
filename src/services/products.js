import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export function getAllProducts() {

  // return {
  //   "products": {
  //     "data": [
  //       {
  //         "id": 1,
  //         "name": "RTX 3060"
  //       },
  //       {
  //         "id": 2,
  //         "name": "RTX 3060 TI"
  //       },
  //       {
  //         "id": 3,
  //         "name": "RTX 3070"
  //       },
  //       {
  //         "id": 4,
  //         "name": "RTX 3070 TI"
  //       }
  //     ]
  //   }
  // }

  axios.get('/product/all')
    .then(function (response) {
      // handle success
      console.log(response);
      return response;
    })
    .catch(function (error) {
      // handle error
      console.log("codigo do erro", error);
    })
    .then(function () {
      // always executed
    });

};

export default { getAllProducts }