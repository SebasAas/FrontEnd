import {
  MOSTRAR_ASISTENCIAS,
  MOSTRAR_ASISTENCIA,
  AGREGAR_ASISTENCIA,
  EDITAR_ASISTENCIA,
  BORRAR_ASISTENCIA,
} from "../actions/types";
import axios from "axios";

//CSS
import Swal from "sweetalert2";

export const mostrarAsistencias = () => async (dispatch) => {
  const asistencias = await axios
    .get(`${process.env.REACT_APP_BACKEND_SERVER}/Asisstance/Asisstances`, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      dispatch({
        type: MOSTRAR_ASISTENCIAS,
        payload: res.data.User,
      });

      if (res.status === 200) {
        return;
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar mostrar asistencias",
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

export const agregarAsistencia = (asistencia) => async (dispatch) => {
  const { timeIn, timeOut, user } = asistencia;

  const data = {
    Asistencia: {
      InTime: timeIn,
      // OutTime : timeOut,
      User: user,
    },
  };

  // console.log(data)

  await axios
    .post(`${process.env.REACT_APP_BACKEND_SERVER}/Asisstance/Create`, data, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha añadido una nueva asistencia",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/rrhh/asistencias";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar crear la asistencia",
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
    type: AGREGAR_ASISTENCIA,
    payload: asistencia,
  });
};

export const editarAsistencia = (asistencia) => async (dispatch) => {
  const { timeIn, timeOut, idAsistencia } = asistencia;

  const data = {
    Asistencia: {
      InTime: timeIn,
      OutTime: timeOut,
      id: idAsistencia,
    },
  };

  // console.log(data)

  await axios
    .post(`${process.env.REACT_APP_BACKEND_SERVER}/Asisstance/Update`, data, {
      headers: { "access-token": localStorage.getItem("access-token") },
    })
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha actualizado una asistencia",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/rrhh/asistencias";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar actualizar la asistencia",
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
    type: EDITAR_ASISTENCIA,
    payload: data,
  });
};

export const eliminarAsistencia = (id) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_BACKEND_SERVER}/Asisstance/Delete`,
      { id: id },
      { headers: { "access-token": localStorage.getItem("access-token") } }
    )
    .then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Correcto!",
          text: "Se ha borrado una asistencia",
          type: "success",
          confirmButtonText: "Confirmar",
        });
        setTimeout(function () {
          window.location.href = "/rrhh/asistencias";
        }, 3500);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Se ha producido un error al intentar borrar la asistencia",
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
    type: BORRAR_ASISTENCIA,
    payload: id,
  });
};
