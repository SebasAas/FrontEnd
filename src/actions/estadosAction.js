import {
  MOSTRAR_ESTADOS,
  AGREGAR_ESTADO,
  EDITAR_ESTADO,
  BORRAR_ESTADO,
} from "../actions/types";
import axios from "axios";

//CSS
import Swal from "sweetalert2";

export const mostrarEstados = () => async (dispatch) => {
  const estados = await axios
    .get(`${process.env.REACT_APP_BACKEND_SERVER}/Estado/Estados`, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      dispatch({
        type: MOSTRAR_ESTADOS,
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
          // localStorage.removeItem("access-token");
          setTimeout(function () {
            return window.location.replace("/");
          }, 3000);
        }
      }
    });
};

export const agregarEstado = (estado) => async (dispatch) => {
  const { descripcion } = estado;

  const data = {
    Description: descripcion,
  };

  await axios
    .post(`${process.env.REACT_APP_BACKEND_SERVER}/Estado/Create`, data, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha añadido un nuevo estado",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/estados";
        }, 3500);
      } else if (res.status === 404) {
        Swal.fire({
          title: "Atencion!",
          text: "No hay datos para mostrar",
          type: "warning",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar crear un estado",
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
    type: AGREGAR_ESTADO,
    payload: estado,
  });
};

export const editarEstado = (estado) => async (dispatch) => {
  const { descripcion, id } = estado;

  const data = {
    Estado: {
      id: id,
      Description: descripcion,
    },
  };

  await axios
    .post(`${process.env.REACT_APP_BACKEND_SERVER}/Estado/Update`, data, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha actualizado el estado",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/estados";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar actualizar un estado",
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
    type: EDITAR_ESTADO,
    payload: data,
  });
};

export const editarEstadoPedido = (pedido) => async (dispatch) => {
  const { id_pedido, id_state } = pedido;

  const data = {
    State: {
      id: id_state,
    },
    Pedido: {
      id: id_pedido,
    },
  };
  await axios
    .post(`${process.env.REACT_APP_BACKEND_SERVER}/Pedido/ChangeState`, data, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha modificado un estado del pedido",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/pedidos";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar modificar un pedido",
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
};

export const eliminarEstado = (id) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_BACKEND_SERVER}/Estado/Delete`,
      { id: id },
      { headers: { "access-token": localStorage.getItem("access-token") } }
    )
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha borrado un estado",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        dispatch({
          type: BORRAR_ESTADO,
          payload: id,
        });
        setTimeout(function () {
          window.location.href = "/estados";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar borrar un estado",
          type: "error",
          confirmButtonText: "Aceptar",
        });
        return window.location.reload();
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
};
