import React, { Component } from "react";
import Swal from "sweetalert2";

//Componentes
import Paper from "@material-ui/core/Paper";
import Header from "../../header/IndexHeader";
import { Redirect } from "react-router-dom";

//CSS
import "../../../assets/css/empleados/form-alta-empleados.css";

//Redux
import { connect } from "react-redux";
import { editarProducto } from "../../../actions/productosAction";

class EditarProducto extends Component {
  state = {
    error: false,
    redirectHome: false,
  };

  nombreRef = React.createRef();
  descripcionRef = React.createRef();
  amountRef = React.createRef();

  componentDidMount() {
    console.log(this.props);
  }

  crearProducto = (e) => {
    e.preventDefault();

    const producto = {
      name: this.nombreRef.current.value,
      description: this.descripcionRef.current.value,
      amount: this.amountRef.current.value,
      id: this.props.location.state.id,
    };

    if (
      producto.name === "" ||
      producto.description === "" ||
      producto.amount === ""
    ) {
      // console.log('error');
      this.setState({ error: true });
      Swal.fire({
        title: "Error!",
        text: "Faltan o hay errores en el formulario",
        type: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    } else {
      this.setState({ error: false });
      // console.log(producto);
      this.props.editarProducto(producto);
    }
  };

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

  render() {
    return (
      <div>
        <Header titulo="Editar Producto" />
        <div className="table-empleados">
          <Paper className="col-md-4">
            <div align="center">
              <form onSubmit={this.crearProducto} className="col-8">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    ref={this.nombreRef}
                    type="text"
                    defaultValue={this.props.location.state.Name}
                    placeholder="Empanadas"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    ref={this.descripcionRef}
                    type="text"
                    defaultValue={this.props.location.state.Description}
                    placeholder="Humita - J&Q - Carne"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    ref={this.amountRef}
                    type="number"
                    defaultValue={this.props.location.state.Amount}
                    placeholder="$"
                    min="1"
                    step="1"
                    title="Numbers only"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Aceptar"
                    className="btn btn-primary"
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  productos: state.productos.productos,
});

export default connect(mapStateToProps, { editarProducto })(EditarProducto);
