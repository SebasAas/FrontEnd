import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Table, Row, Col } from "react-bootstrap";

import axios from "axios";

class ReporteGanancias extends Component {
  state = {
    reporte_ganancias: [],
    ganancia_total: [],
    fecha_ganancia: [],
    monto_ganancia: [],
    datos_ganancia: [],
    data_chart: {},
    hayValor: false,
    loading: false,
  };

  handleEvent = (event, picker) => {
    this.setState({
      data_chart: {},
      reporte_ganancias: [],
      loading: true,
    });

    const gastos = axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_SERVER
        }/Reports/Ganancias?min=${picker.startDate.format(
          "YYYY-MM-DD"
        )}&max=${picker.endDate.format("YYYY-MM-DD")}`,
        { headers: { "access-token": localStorage.getItem("access-token") } }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.setState({
              reporte_ganancias: res.data,
              ganancia_total: res.data,
              fecha_ganancia: [],
              monto_ganancia: [],
            });

            if (this.state.reporte_ganancias.length > 0) {
              this.state.reporte_ganancias.map((ganancia) => {
                this.state.fecha_ganancia.push(ganancia.day);
                this.state.monto_ganancia.push(ganancia.amount);
              });

              this.state.data_chart = {
                labels: this.state.fecha_ganancia,
                datasets: [
                  {
                    label: "Ganancias",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 10,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 5,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.state.monto_ganancia,
                  },
                ],
              };

              this.setState({
                hayValor: true,
                loading: false,
              });
            }
          } else {
            this.setState({
              hayValor: false,
              loading: false,
            });
          }
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  mostrarInfo = () => {
    if (this.state.hayValor === false && this.state.loading === false) {
      return (
        <React.Fragment>
          <h3 style={{ textAlign: "center" }}>No hay valores para mostrar</h3>
        </React.Fragment>
      );
    } else if (this.state.loading === true) {
      return (
        <React.Fragment>
          <h3 style={{ textAlign: "center" }}>Cargando..</h3>
        </React.Fragment>
      );
    } else {
      let count = 1;

      return (
        <div style={{ height: 500, width: "100%", display: "inline-block" }}>
          <React.Fragment>
            <Line
              style={{ height: 150, width: 150 }}
              data={this.state.data_chart}
              width={150}
              height={150}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </React.Fragment>
          <React.Fragment>
            <h3 style={{ textAlign: "center" }}>Datos Especificos</h3>
            <Table responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th style={{ textAlign: "center" }}>#</th>
                  <th style={{ textAlign: "center" }}>Fecha del Ganancia</th>
                  <th style={{ textAlign: "center" }}>Monto del Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {this.state.reporte_ganancias.map((ganancia) => (
                  <tr key={ganancia.day}>
                    <td>{count++}</td>
                    <td>{ganancia.day}</td>
                    <td>{ganancia.amount}</td>
                  </tr>
                ))}

                {console.log(this.state)}
              </tbody>
            </Table>
          </React.Fragment>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <DateRangePicker onApply={this.handleEvent}>
          <div align="center" style={{ textAlign: "center" }}>
            <Row
              align="center"
              style={{ width: "800px" }}
              className="show-grid"
            >
              <Col xs={1} md={4}>
                <button className="btn btn-primary">
                  Ingrese una rango de fechas
                </button>
              </Col>
              <Col
                style={{ textAlign: "center" }}
                align="center"
                xs={11}
                md={7}
              ></Col>
            </Row>
          </div>
        </DateRangePicker>

        <h3 style={{ textAlign: "center" }}>Ganancias Brutas</h3>
        {this.mostrarInfo()}
      </div>
    );
  }
}

export default ReporteGanancias;
