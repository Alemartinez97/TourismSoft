import React from "react";
import MaterialTable, { MTableCell } from "material-table";
import api from "../../components/utils/api";
import { Container } from "@material-ui/core";
import { connect } from "react-redux";
import { editPerson, deletePerson, setPerson } from "../../components/actions/index";
import { withRouter } from "react-router-dom";
import { Icons } from "../icons";

const Form = (props) => {
  // const { person } = props;
  // console.log("props:",props.person.person);
  return (
    <div>
      <Container>
        <MaterialTable
          components={{
            Cell: (props) => (
              <MTableCell
                {...props}
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  maxWidth: 200,
                }}
              />
            ),
          }}
          options={{
            search: true,
            paging: true,
            toolbarButtonAlignment: "left",
            actionsColumnIndex: 8,
            pageSizeOptions: [10, 20, 30],
            paginationType: "stepped",
            actionsColumnIndex: 99,
          }}
          title={"Nueva Reserva"}
          columns={[
            {
              title: "Nombre",
              field: "name",
            },
            { title: "Correo", field: "email" },
            { title: "WhatSapp", field: "whatsapp" },
            {
              title: "Desde",
              field: "start",
              type: "date",
            },
            {
              title: "Hasta",
              field: "end",
              type: "date",
            },
            {
              title: "Cantidad de Personas",
              field: "person",
              type:"numeric"
            },
          ]}
          data={props.person}
          editable={{
            onRowAdd: (newData) => {
              return api.post("/reserve", newData).then((result) => {
                const person = {
                  id: result.data.response,
                  ...newData,
                };
                props.setPerson(person);
              });
            },
            onRowUpdate: (newData) => {
              return api
                .put(`/reserve/${newData.id}`, newData)
                .then((result) => {
                  const person = {
                    id: result.data.response,
                    ...newData,
                  };
                  props.editPerson(person);
                });
            },
            onRowDelete: (newData) => {
              debugger
              return api
                ._delete(`/reserve/${newData.id}`)
                .then((result) => {
                  const person = {
                    id: result.data.response,
                    ...newData,
                  };
                  props.deletePerson(person);
                });
            },
          }}
          style={{
            marginBottom: 20,
          }}
          icons={Icons}
        ></MaterialTable>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  debugger
  return { person: state.person};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPerson: (person) => dispatch(setPerson(person)),
    editPerson: (person) => dispatch(editPerson(person)),
    deletePerson: (person) => dispatch(deletePerson(person)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Form));
