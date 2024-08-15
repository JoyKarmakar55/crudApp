import React, { useEffect, useState } from "react";
import "./user.css";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const User = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [userss, setUserss] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [editUser, setEditUser] = useState({
    _id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/api/getall");
      setUserss(response.data);
    };

    fetchData();
  }, []);

  const usersPerPage = 5;
  const totalPages = Math.ceil(userss.length / usersPerPage);

  const handleClickNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handleClickPrev = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const users = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
  const [user, setUser] = useState(users);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleEditForm = (user) => {
    setEditUser(user);
    setShowEditForm(!showEditForm);
  };

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/create", user);
      toast.success("Employee added successfully", { position: "top-center" });
      setShowForm(false);
      const updatedUsers = await axios.get("http://localhost:8000/api/getall");
      setUserss(updatedUsers.data);
    } catch (error) {
      console.error("Error adding Employee:", error);
      toast.error("Error adding Employee", { position: "top-center" });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/update/${editUser._id}`,
        editUser
      );
      toast.success(response.data.msg, { position: "top-center" });
      const updatedUsers = await axios.get("http://localhost:8000/api/getall");
      setUserss(updatedUsers.data);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error editing Employee:", error);
      toast.error("Error editing Employee", { position: "top-center" });
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Employee?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:8000/api/delete/${userId}`);
        setUserss(userss.filter((user) => user._id !== userId));
        toast.success("Employee deleted successfully", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting Employee:", error);
      toast.error("Error deleting Employee", { position: "top-center" });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/delete`, {
        data: { ids: selectedUsers },
      });
      setUserss(userss.filter((user) => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      toast.success("Selected Employee deleted successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting Employees:", error);
      toast.error("Error deletingEmployees", { position: "top-center" });
    }
  };

  return (
    <>
      <div className="header">
        <h2 className="ml-5">
          Manage Employees
          <button
            className="cancel-btn mr-3 ml-5 "
            onClick={handleDeleteSelected}
          >
            <FaMinusCircle size={20} /> Delete
          </button>
          <button className="add-btn" onClick={toggleForm}>
            <FaPlusCircle size={20} /> Add New Employee
          </button>
        </h2>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="popup-form">
            <h1>Add Employee</h1>
            <form>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Name</label>
                <input
                  type="name"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={inputHandler}
                  placeholder="Employee Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  onChange={inputHandler}
                  placeholder="example@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  onChange={inputHandler}
                  rows={3}
                  defaultValue={""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Phone</label>
                <input
                  type="name"
                  className="form-control"
                  id="phone"
                  name="phone"
                  onChange={inputHandler}
                  placeholder="Employee Name"
                />
              </div>
              <div className="form-actions float-right">
                <button className="cancel-btn" onClick={toggleForm}>
                  Cancel
                </button>
                <button
                  className="add-btn ml-3 float-right"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="popup-form">
            <h1>Edit Employee</h1>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="exampleFormControlInput1">Name</label>
                <input
                  type="name"
                  className="form-control"
                  id="name"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditInputChange}
                  placeholder="Employee Name"
                />

                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditInputChange}
                  placeholder="example@example.com"
                />

                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  value={editUser.address}
                  onChange={handleEditInputChange}
                  rows={3}
                  defaultValue={""}
                />

                <input
                  type="name"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={editUser.phone}
                  onChange={handleEditInputChange}
                  placeholder="Employee Name"
                />
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={toggleForm}>
                  Cancel
                </button>
                <button
                  className="add-btn"
                  type="submit"
                  onClick={handleEditSubmit}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="user-table-container">
        <table
          className="user-table"
          style={{ textAlign: "center" }}
          cellPadding={10}
          cellSpacing={5}
          align="center"
        >
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={() =>
                    setUserss(
                      userss.map((user) => ({
                        ...user,
                        isChecked: !user.isChecked,
                      }))
                    )
                  }
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userss
              .slice(
                currentPage * usersPerPage,
                (currentPage + 1) * usersPerPage
              )
              .map((user) => {
                return (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.phone}</td>
                    <td className="action-btn">
                      <button
                        className="edit-btn"
                        onClick={() => toggleEditForm(user)}
                      >
                        <MdEdit />
                      </button>
                      <button onClick={() => deleteUser(user._id)}>
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination-container">
          <span className="mr-5 float-left">
            Showing 5 out of {userss.length} results
          </span>
          <button
            className="pagination-btn float-right "
            onClick={handleClickPrev}
          >
            ▶️
          </button>
          <span className="float-right">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className="pagination-btn float-right"
            onClick={handleClickNext}
          >
            ◀️
          </button>
        </div>
      </div>
    </>
  );
};

export default User;
