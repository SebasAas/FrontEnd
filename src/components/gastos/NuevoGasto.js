import React, { Component } from "react";
import axios from "axios";

//Componentes
import Paper from "@material-ui/core/Paper";
import Header from "../header/IndexHeader";
import { Redirect } from "react-router-dom";

//Redux
import { connect } from "react-redux";
import { agregarGasto } from "../../actions/gastosAction";

//CSS
import Swal from "sweetalert2";
import "../../assets/css/empleados/form-alta-empleados.css";

class NuevoGasto extends Component {
  state = {
    currentUser: "",
    redirectHome: false,
    disabledSend: false,
  };

  detalleRef = React.createRef();
  montoRef = React.createRef();
  fechaRef = React.createRef();

  componentWillMount() {
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER}/User/CurrentUser`, {
        headers: { "access-token": localStorage.getItem("access-token") },
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            currentUser: res.data.User.Id,
          });
        }
      })
      .catch((err) => {
        return;
      });
    // console.log(this.props);
  }

  ToHome() {
    if (this.state.redirectHome) {
      return <Redirect to="/" />;
    }
  }

  setRedirectToHome = () => {
    this.setState({
      redirectHome: true,
    });
  };

  agregarGasto = (e) => {
    e.preventDefault();
    this.setState({
      disabledSend: true,
    });

    let fechaArr = this.fechaRef.current.value.split("-");

    const fecha = fechaArr[2] + "/" + fechaArr[1] + "/" + fechaArr[0];

    if (fechaArr[0].length == 5 || fechaArr[0].length === 5) {
      Swal.fire({
        title: "Error!",
        text: "La fecha esta mal ingresada, favor de chequearla",
        type: "error",
        confirmButtonText: "Aceptar",
      });
      this.setState({
        disabledSend: false,
      });
      return;
    } else {
      const gasto = {
        details: this.detalleRef.current.value,
        amount: this.montoRef.current.value,
        date: fecha,
        user: this.state.currentUser,
      };

      // console.log(gasto);
      this.props.agregarGasto(gasto);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header titulo="Alta de Gasto" />
        <div className="table-empleados">
          <Paper className="col-md-5">
            <div>
              <form onSubmit={this.agregarGasto} className="col-5">
                <div className="form-group">
                  <label>Nombre del Gasto</label>
                  <input
                    ref={this.detalleRef}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Monto</label>
                  <input
                    ref={this.montoRef}
                    type="number"
                    min="1"
                    step="1"
                    title="Numbers only"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    ref={this.fechaRef}
                    type="date"
                    max="9999-12-12"
                    className="form-control"
                    required
                  />
                </div>
                <div center="true" align="center" className="form-group">
                  <input
                    disabled={this.state.disabledSend}
                    type="submit"
                    value="Aceptar"
                    className="btn btn-primary"
                    required
                  />
                  <button
                    style={{ marginLeft: 20, width: 80 }}
                    onClick={this.setRedirectToHome}
                    type="button"
                    className="btn btn-danger"
                  >
                    Cancelar
                  </button>
                  {this.ToHome()}
                </div>
              </form>
            </div>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  gastos: state.gastos.gastos,
});

export default connect(mapStateToProps, { agregarGasto })(NuevoGasto);
