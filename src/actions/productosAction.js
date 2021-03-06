import {
  MOSTRAR_PRODUCTOS,
  MOSTRAR_PRODUCTO,
  AGREGAR_PRODUCTO,
  EDITAR_PRODUCTO,
  BORRAR_PRODUCTO,
} from "./types";
import axios from "axios";

//CSS
import Swal from "sweetalert2";

export const mostrarProductos = () => async (dispatch) => {
  const productos = await axios
    .get(`${process.env.REACT_APP_BACKEND_SERVER}/Product/Products`, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      //console.log(res.data)
      dispatch({
        type: MOSTRAR_PRODUCTOS,
        payload: res.data,
      });

      if (res.status === 200) {
        return;
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar mostrar estados",
          type: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 404) {
          Swal.fire({
            title: "Error!",
            text: `${err.response.data}`,
            type: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
        if (err.response.status === 401) {
          Swal.fire({
            title: "Error!",
            text: `No posee los permisos necesarios`,
            type: "error",
            confirmButtonText: "Aceptar",
          });
          setTimeout(function () {
            return window.location.replace("/");
          }, 3000);
        }
      } else {
        const serializedProduct = localStorage.getItem("productos");
        let deserializedProduct;

        deserializedProduct = JSON.parse(serializedProduct);

        dispatch({
          type: MOSTRAR_PRODUCTOS,
          payload: deserializedProduct,
        });
        // console.log(deserializedProduct)
      }
    });
};

export const mostrarProducto = (id) => async (dispatch) => {
  const producto = await axios.get(
    `${process.env.REACT_APP_BACKEND_SERVER}/Category/Category?id=${id}`,
    { headers: { "access-token": localStorage.getItem("access-token") } }
  );

  // console.log(producto.data.categoria)

  dispatch({
    type: MOSTRAR_PRODUCTO,
    payload: producto.data.categoria,
  });
};

export const agregarProducto = (producto) => async (dispatch) => {
  // console.log(empleado);
  const { name, description, amount, category } = producto;

  const data = {
    Name: name,
    Description: description,
    Amount: amount,
    Category: category,
  };

  await axios
    .post(
      `${process.env.REACT_APP_BACKEND_SERVER}/Product/CreateProduct`,
      data,
      {
        headers: { "access-token": localStorage.getItem("access-token") },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha añadido un nuevo producto",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/categoria";
        }, 3500);
      } else {
        //console.log(res)
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar crear el producto",
          type: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    })
    .catch((err) => {
      Swal.fire({
        title: "Error!",
        text: "El Servidor no ha respondido la solicitud",
        type: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    });

  dispatch({
    type: AGREGAR_PRODUCTO,
    payload: producto,
  });
};

export const eliminarProducto = (id) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_BACKEND_SERVER}/Product/DeleteProduct`,
      { id: id },
      { headers: { "access-token": localStorage.getItem("access-token") } }
    )
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha borrado un producto",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/categoria";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar borrar el producto",
          type: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    })
    .catch((err) => {
      Swal.fire({
        title: "Error!",
        text: "El Servidor no ha respondido la solicitud",
        type: "error",
        confirmButtonText: "Aceptar",
      });
      return window.location.reload();
    });

  dispatch({
    type: BORRAR_PRODUCTO,
    payload: id,
  });
};

export const editarProducto = (producto) => async (dispatch) => {
  // console.log(empleado);
  const { name, description, amount, id } = producto;

  const data = {
    Producto: {
      Name: name,
      Description: description,
      Amount: amount,
      id: id,
    },
  };

  await axios
    .post(
      `${process.env.REACT_APP_BACKEND_SERVER}/Product/UpdateProduct`,
      data,
      {
        headers: { "access-token": localStorage.getItem("access-token") },
      }
    )
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha actualizado un producto",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/categoria";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar actualizar el producto",
          type: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    })
    .catch((err) => {
      Swal.fire({
        title: "Error!",
        text: "El Servidor no ha respondido la solicitud",
        type: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    });

  dispatch({
    type: EDITAR_PRODUCTO,
    payload: producto,
  });
};
