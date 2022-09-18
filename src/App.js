import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);

  const sortOptions = ["name", "email", "phone", "address", "status"];

  useEffect(() => {
    loadUsersData(0,4,0);
  }, []);

  const loadUsersData = async (start, end, increase) => {
    return await axios
      .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
      .then((response) => {
        setData(response.data);
        setCurrentPage(currentPage + increase);
      })
      .catch((error) => console.log(error));
  };

  const handleReset = () => {
    loadUsersData(0,4,0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(`http://localhost:5000/users?q=${value}`)
      .then((response) => {
        setData(response.data);
        setValue("");
      })
      .catch((error) => console.log(error));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    return await axios
      .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  };

  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:5000/users?status=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  };

  const renderPagination = () => {
    if(currentPage === 0){
      return(
        <MDBPagination>
          <MDBPaginationItem>
            <MDBPaginationLink><b>1</b></MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn color="dark" onClick={() => loadUsersData(4,8, 1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (currentPage < pageLimit -1 && data.length === pageLimit){
      return (
        <MDBPagination className="mb=0">
          <MDBPaginationItem>
            <MDBBtn
              color="dark"
              onClick={() =>
                loadUsersData((currentPage - 1) * 4, currentPage * 4, -1)
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              color="dark"
              onClick={() =>
                loadUsersData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination>
          <MDBPaginationItem>
            <MDBBtn color="dark" onClick={() => loadUsersData(4,8, -1)}>
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>
              <b>{currentPage+1}</b>
            </MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  }

  return (
    <MDBContainer>
      <div style={{ marginTop: "20px" }}>
        <h2 className="text-center mb-3">Search Filter Sort and Pagination</h2>
        <form
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "500px",
            alignContent: "center",
            marginBottom: "1.5rem",
            borderRadius: "10px",
          }}
          className="d-flex input-group w-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name.."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <MDBBtn
            type="submit"
            className="mx-2"
            color="primary"
            style={{ borderRadius: "5px" }}
          >
            Search
          </MDBBtn>
          <MDBBtn
            className="mx-2"
            color="info"
            onClick={() => handleReset()}
            style={{ borderRadius: "5px" }}
          >
            Reset
          </MDBBtn>
        </form>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr style={{ fontSize: "1rem" }}>
                  <th scope="col">No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
            marginBottom: "1.5rem",
            borderRadius: "10px",
          }}
        >
          {renderPagination()}
        </div>
      </div>
      <MDBRow style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <MDBCol size="8">
          <h5>Sort by:</h5>
          <select
            style={{ width: "50%", borderRadius: "4px", height: "35px" }}
            onChange={handleSort}
            value={sortValue}
          >
            <option>Select</option>
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size="4">
          <h5>Filter by Status</h5>
          <MDBBtn color="success" onClick={() => handleFilter("Active")}>
            Active
          </MDBBtn>
          <MDBBtn
            style={{ marginLeft: "1rem" }}
            color="danger"
            onClick={() => handleFilter("Inactive")}
          >
            Inactive
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
