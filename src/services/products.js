import axios from "axios";

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

  axios.get('localhost:8080/product/all')
    .then(function (response) {
      // handle success
      console.log(response);
      debugger;
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