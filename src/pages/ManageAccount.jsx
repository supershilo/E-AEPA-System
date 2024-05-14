import React, { useState, useEffect } from "react";

import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert as MuiAlert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TableRow from "@mui/material/TableRow";
import FormHelperText from "@mui/material/FormHelperText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CustomAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Set the duration in milliseconds (e.g., 3000ms or 3 seconds)
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Set the Snackbar position to the center
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={severity}
        style={{ fontFamily: "Poppins" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function ManageAccount() {
  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setopenDeleteDialog] = useState(false);
  const [empStatus, setempStatus] = useState("");
  const [probeStatus, setProbeStatus] = useState("");
  const [gender, setGender] = useState("");
  const [dept, setdept] = useState("");
  const [role, setRole] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const [successAlert, setSuccessAlert] = useState({open: false,message: "",});
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departments, setDepartments] = useState([]);
  const [checkUsername, setCheckUsername] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const [workID, setWorkID] = useState("");
  const [position, setPosition] = useState("");
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dateHired, setDateHired] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updateFetch, setUpdateFetch] = useState(true);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [emailIsAvailable, setEmailIsAvailable] = useState(false);
  const [emailIsTaken, setEmailIsTaken] = useState(false);
  const [emailMsgInfo, setEmailMsgInfo] = useState("");

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDateHiredChange = (e) => {
    setDateHired(e.target.value);
  };

  const handleDateStartedChange = (e) => {
    setDateStarted(e.target.value);
  };

  const handleFNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleMNameChange = (e) => {
    setMiddleName(e.target.value);
  };

  const handleLNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    // Dynamically update the position based on the selected role
    if (selectedRole === "HEAD") {
      setPosition("Department Head");
    }
  };

  const handleWorkIdChange = (e) => {
    setWorkID(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleCheckUsername = (e) => {
    let username;
    if(role==="ADMIN") {
      username = `adm_${firstname}.${lastname}`;
    } else {
      username = `${firstname}.${lastname}`;
    }
    setMsgInfo(''); 
  };


  //check username availability
  useEffect(() => {
    const fetchUsername = async () => {
      let username
      try {
        if(role==="ADMIN") {
          username = `adm_${firstname}.${lastname}`;
        } else {
        username = `${firstname}.${lastname}`;
        }
        const response = await axios.put(`http://localhost:8080/user/checkUsername/${username}`);
        const availability = response.data === 'Username available';
        setMsgInfo(response.data);
        setIsAvailable(availability);
        setIsTaken(!availability); // If available, not taken; if not available, taken
      } catch (error) {
        console.error('Error checking username:', error);
        setMsgInfo('Error checking username');
        setIsAvailable(false);
        setIsTaken(false);
      }
    };

    if (firstname && lastname) {
      fetchUsername();
    } else {
      setMsgInfo('');
      setIsAvailable(false);
      setIsTaken(false);
    }
  }, [firstname, lastname]);

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isNotEmpty = password.trim() !== "" || confirmPassword.trim() !== "";

  //fetch all departments
  useEffect(() => {
    const fetchDept = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/department/getAllDepts"
        );
        setDepartments(response.data);
        console.log(departments);
      } catch (error) {
        if (error.response) {
          //not in 200 response range
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    };

    fetchDept();
  }, []);

  const handleEmailChange = (event) => {
    const email = `${firstname}.${lastname}@cit.edu`;
    setEmailMsgInfo(''); 
  };

  //check username availability
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const email = `${firstname}.${lastname}@cit.edu`;
        const response = await axios.put(`http://localhost:8080/user/checkEmail/${email}`);
        const emailAvailability = response.data === 'Email Address is available';
        setEmailMsgInfo(response.data);
        setEmailIsAvailable(emailAvailability);
        setEmailIsTaken(!emailAvailability); // If available, not taken; if not available, taken
      } catch (error) {
        console.error('Error checking username:', error);
        setEmailMsgInfo('Error checking username');
        setEmailIsAvailable(false);
        setEmailIsTaken(false);
      }
    };

    if (firstname && lastname) {
      fetchEmail();
    } else {
      setEmailMsgInfo('');
      setEmailIsAvailable(false);
      setEmailIsTaken(false);
    }
  }, [firstname, lastname]);

  const showSuccessAlert = (message) => {
    setSuccessAlert({ open: true, message });
  };

  // Function to open error alert
  const showErrorAlert = (message) => {
    setErrorAlert({ open: true, message });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleClickAddUserBtn = () => {
    setOpenRegistrationDialog(true);
  };

  //handle selected user
  const handleClickEditBtn = async (userID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/getUser/${userID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setSelectedUser(userData);
      setOpenEditDialog(true);
      console.log("Selected User:", selectedUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //handle updated user body
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    console.log("Updating:", name, value);
    setSelectedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //save edit user account
  const handleEditUserSave = async (e, selectedUser) => {
    e.preventDefault();
    try {
      console.log("sending user data: ", selectedUser);

      const userPayload = {
        userID: selectedUser.userID,
        workID: selectedUser.workID,
        fName: selectedUser.fName,
        mName: selectedUser.mName,
        lName: selectedUser.lName,
        workEmail: selectedUser.workEmail,
        username: selectedUser.username,
        position: selectedUser.position,
        dept: selectedUser.dept,
        empStatus: selectedUser.empStatus,
        dateStarted: selectedUser.dateStarted,
      };
      await axios.patch(
        `http://localhost:8080/user/editUser/${selectedUser.userID}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateFetch((prev) => !prev);
      showSuccessAlert("User updated successfully");
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorAlert("Failed to update user. Please try again later.");
    }
  };

  //handle delete user
  const handleClickDeleteBtn = (userID) => {
    console.log("delete user:", userID);
    const selectedUser = rows.find((user) => user.userID === userID);
    setSelectedUser(selectedUser);
    setopenDeleteDialog(true);
    setUpdateFetch(!updateFetch);
  };

  const handleYesDelBtn = async (userID) => {
    console.log("delete Yes user:", userID);
    try {
      const response = await fetch(
        `http://localhost:8080/user/delete/${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      // Optionally, you can handle success or update UI accordingly
      showSuccessAlert("User deleted successfully");
      setUpdateFetch((prev) => !prev);
      setopenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleClickCloseBtn = () => {
    setOpenRegistrationDialog(false);
    setempStatus("");
    setProbeStatus("");
    setDateStarted("");
    setDateHired("");
    setCheckUsername("");
    setWorkID("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setPosition("");
    setdept("");
    setRole("");
    setopenDeleteDialog(false);
    setOpenEditDialog(false);
  };

  //handle create user account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    let username
    try {
      if (role==="ADMIN") {
        username = `adm.${firstname}.${lastname}`;
      } else {
        username = `${firstname}.${lastname}`;
      }
      const email = `${firstname}.${lastname}@cit.edu`;
      
      const userData = {
        empStatus: empStatus,
        probeStatus: probeStatus,
        dateStarted: dateStarted,
        dateHired: dateHired,
        username: username,
        workID: workID,
        fName: firstname,
        mName: middlename,
        lName: lastname,
        workEmail: email,
        gender: gender,
        password: password,
        position: position,
        dept: dept,
        role: role,
      };

      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showSuccessAlert("User registered successfully");
        setempStatus("");
        setProbeStatus("");
        setDateStarted("");
        setDateHired("");
        setCheckUsername("");
        setWorkID("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setGender("");
        setPassword("");
        setConfirmPassword("");
        setPosition("");
        setdept("");
        setRole("");
        setUpdateFetch((prev) => !prev);
        setOpenRegistrationDialog(false);
      } else {
        showErrorAlert("Failed to register user. User already exists.");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  //handles re-rendering
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/getAllUser");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // Filter data based on selected tab
        const filteredData = data.filter((item) => {
          if (selectedTab === 0) {
            // All Employees
            return item.role !== "ADMIN";
          } else if (selectedTab === 1) {
            // All Admins
            return item.role === "ADMIN";
          }
        });
        // Process the data and set rows
        const processedData = filteredData.map((item) => ({
          ...item,
          name: `${item.fName} ${item.lName}`,
          userID: item.userID,
        }));
        setRows(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateFetch, selectedTab]);

  const handleEmploymentStatus = (event) => {
    setempStatus(event.target.value);
    if (event.target.value !== "Probationary") {
      setProbeStatus("");
      setDateStarted("");
    }
  };

  const handleProbeStatus = (event) => {
    setProbeStatus(event.target.value);
  };

  const handledept = (event) => {
    setdept(event.target.value);
  };

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const columnsEmployees = [
    {
      id: "workID",
      label: "ID Number",
      align: "center",
      minWidth: 150,
    },

    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
      format: (value) => formatName(value),
    },

    {
      id: "workEmail",
      label: "Email",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "dept",
      label: "Department",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "position",
      label: "Position",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      align: "center",
      format: (value, row) => {
        return (
          <div>
            <IconButton onClick={() => handleClickEditBtn(row.userID)}>
              <EditNoteTwoToneIcon sx={{ fontSize: "1.8em" }} />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleClickDeleteBtn(row.userID)}
            >
              <DeleteOutlineIcon sx={{ fontSize: "1.5em" }} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const columnsAdmins = [
    {
      id: "workID",
      label: "ID Number",
      align: "center",
      minWidth: 150,
    },

    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
      format: (value) => (value ? `${value.fName} ${value.lName}` : ""),
    },

    {
      id: "username",
      label: "Username",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },

    {
      id: "workEmail",
      label: "Email",
      minWidth: 170,
      align: "center",
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      align: "center",
      format: (value, row) => (
        <div>
          <IconButton onClick={() => handleClickEditBtn(row.userID)}>
            <EditNoteTwoToneIcon sx={{ fontSize: "1.8em" }} />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleClickDeleteBtn(row.userID)}
          >
            <DeleteOutlineIcon sx={{ fontSize: "1.5em" }} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Typography
        ml={5}
        mt={3}
        sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "25px" }}
      >
        User Accounts
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            ml: 5,
            mt: 0.5,
            width: "95%",
          },
        }}
      >
        <Grid
          container
          spacing={1.5}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: "4px 4px 0 0",
              height: 15,
              mt: 3,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{
                fontSize: "18px",
                height: "2.5em",
                width: "8em",
                mb: 4,
                fontFamily: "Poppins",
                backgroundColor: "#8c383e",
                padding: "1px 1px 0 0 ",
                "&:hover": {
                  backgroundColor: "#F8C702",
                  color: "black",
                },
              }}
              style={{
                textTransform: "none",
              }}
              startIcon={<AddCircleIcon />}
              onClick={handleClickAddUserBtn}
            >
              Add User
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ height: "4em", display: "flex", padding: "0px" }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab
                label="All Employees"
                style={{
                  fontFamily: "Poppins",
                  textTransform: "none",
                  fontSize: "1em",
                }}
              />
              <Tab
                label="All Admins"
                style={{
                  fontFamily: "Poppins",
                  textTransform: "none",
                  fontSize: "1em",
                }}
              />
            </Tabs>
          </Grid>

          <Paper
            elevation={3}
            sx={{ borderRadius: "10px", width: "100%", height: "52em" }}
          >
            <TableContainer
              sx={{ borderRadius: "10px 10px 0 0 ", maxHeight: "100%" }}
            >
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead sx={{ height: "3.5em" }}>
                  <TableRow>
                    {(selectedTab === 0 ? columnsEmployees : columnsAdmins).map(
                      (column) => (
                        <TableCell
                          sx={{
                            fontFamily: "Poppins",
                            bgcolor: "#8c383e",
                            color: "white",
                            fontWeight: "bold",
                            maxWidth: "3.5em",
                            fontSize: "1em",
                          }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(248, 199, 2, 0.5)",
                          color: "black",
                        },
                      }}
                      key={row.id}
                    >
                      {(selectedTab === 0
                        ? columnsEmployees
                        : columnsAdmins
                      ).map((column) => (
                        <TableCell
                          sx={{ fontFamily: "Poppins", fontSize: "1em"}}
                          key={`${row.id}-${column.id}`}
                          align={column.align}
                        >
                          {column.id === "name"
                            ? row.name
                            : column.id === "actions"
                            ? column.format
                              ? column.format(row[column.id], row)
                              : null
                            : column.format
                            ? column.format(row[column.id])
                            : row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Box>

      {/* regis pop up screen */}
      <Dialog
        open={openRegistrationDialog}
        onClose={handleClickCloseBtn}
      >
        <Box
          sx={{
            bgcolor: "#8c383e",
            height: "2.79em",
            width: "100%",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Grid
                container
                spacing={0.6}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "transparent",
                  alignItems: "center", // Align items vertically
                }}
              >
                <Grid item sx={{ height: "3.3em"}}>
                  <PersonRoundedIcon
                    sx={{ color: "white", fontSize: "1.8em", ml: 1, mt: .8 }}
                  />
                </Grid>
                <Grid item sx={{ fontSize: "1.1em" }}>
                  Register User Account
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <IconButton
            onClick={handleClickCloseBtn}
            sx={{
              "&:hover": {
                color: "#F8C702",
              },
            }}
          >
            <HighlightOffOutlinedIcon
              sx={{ fontSize: "1.4em", color: "white" }}
            />
          </IconButton>
        </Box>
        <form onSubmit={handleCreateAccount}>
          <DialogContent>
            <Grid
              container
              spacing={0.6}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "left",
                width: "100%",
              }}
            >
              <Grid container  sx={{ width: "45vh"}}>
                <Grid item xs={3} sx={{ margin: 1 }}>
                  <Typography style={{ fontFamily: "Poppins", color: "gray" }}>
                    User Role:{" "}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <FormControl sx={{ width: "22em" }}>
                    <Select
                      labelId="roleLabel"
                      id="role"
                      value={role}
                      onChange={handleRoleChange}
                      size="small"
                      sx={{ fontFamily: "Poppins" }}
                    >
                      <MenuItem style={{ fontFamily: "Poppins" }} value="ADMIN">
                        Admin
                      </MenuItem>
                      <MenuItem
                        style={{ fontFamily: "Poppins" }}
                        value="EMPLOYEE"
                      >
                        Employee
                      </MenuItem>
                      <MenuItem
                        style={{ fontFamily: "Poppins" }}
                        value="HEAD"
                      >
                        Department Head
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={0.6}
              sx={{
                width: "100%",
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {role === "ADMIN" && (
                <>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="First Name"
                        id="fName"
                        value={firstname}
                        onChange={handleFNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        fullWidth
                        size="medium"
                        label="Middle Name"
                        id="mName"
                        value={middlename}
                        onChange={handleMNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Last Name"
                        id="lName"
                        value={lastname}
                        onChange={handleLNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="ID Number"
                        id="workId"
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                        value={workID}
                        onChange={handleWorkIdChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                  <Box>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Username"
                        id="username"
                        value={`adm_${firstname}.${lastname}`}
                        onChange={handleCheckUsername}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                      {(isTaken) && (
                        <FormHelperText
                          style={{
                            color:  "red",
                          }}
                        >
                          {msgInfo}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                  <Box >
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Admin Email Address"
                        id="email"
                        value={`${firstname}.${lastname}@.cit.edu`}
                        onChange={handleEmailChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                        error={emailError}
                        helperText={
                          emailError ? "Please enter a valid email" : ""
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Admin Username"
                        id="username"
                        value={checkUsername}
                        onChange={handleCheckUsername}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                      {(emailIsTaken) && (
                        <FormHelperText
                          style={{
                            color:"red",
                          }}
                        >
                          {emailMsgInfo}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ height: "100%" }}>
                      <div style={{ position: "relative", width: "100%" }}>
                        <TextField
                          required
                          fullWidth
                          size="medium"
                          label="Admin Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          InputLabelProps={{
                            style: {
                              fontFamily: "Poppins",
                            },
                          }}
                          inputProps={{
                            style: {
                              fontSize: "16px",
                              fontFamily: "Poppins",
                            },
                          }}
                          onChange={handlePassword}
                        />
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          onClick={handleShowPassword}
                          style={{
                            color: "#636E72",
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        fullWidth
                        size="medium"
                        label="Confirm Admin Password"
                        type="password"
                        id="confirmpassword"
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                        onChange={handleConfirmPassword}
                      />

                      {isNotEmpty && (
                        <FormHelperText
                          style={{
                            color:
                              password !== confirmPassword ? "red" : "green",
                          }}
                        >
                          {password !== confirmPassword
                            ? "Passwords do not match"
                            : "Passwords match"}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </>
              )}

              {(role === "EMPLOYEE" || role === "HEAD") && (
                <>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box>
                      <FormControl fullWidth size="medium" required>
                        <InputLabel
                          id="employementStatusLabel"
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employment Status
                        </InputLabel>
                        <Select
                          required
                          labelId="employementStatusLabel"
                          id="employementStatus"
                          value={empStatus}
                          label="employment status"
                          onChange={handleEmploymentStatus}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value="Probationary"
                          >
                            Probationary
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value="Regular"
                          >
                            Regular
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box
                      sx={{ bgcolor: empStatus ? "inherit" : "transparent" }}
                    >
                      <FormControl
                        fullWidth
                        size="medium"
                        disabled={empStatus === "Regular"}
                        required
                      >
                        <InputLabel
                          id="probationaryStatus"
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                          }}
                        >
                          Probationary Status
                        </InputLabel>
                        <Select
                          required
                          labelId="probationaryStatusLabel"
                          id="probeStat"
                          value={probeStatus}
                          label="probationary status"
                          onChange={handleProbeStatus}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"3rd Probationary"}
                          >
                            3rd Probationary
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"5th Probationary"}
                          >
                            5th Probationary
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        bgcolor:
                          empStatus == "Regular" ? "inherit" : "transparent",
                      }}
                    >
                      <TextField
                        required
                        fullWidth
                        disabled={empStatus === "Regular"}
                        size="medium"
                        label="Date Started "
                        id="dateStarted"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                          // Add a pattern to enforce the format MM/DD/YY
                          pattern:
                            "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                        }}
                        value={dateStarted}
                        onChange={handleDateStartedChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8} sx={{ width: "100%" }}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="ID Number"
                        id="workId"
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                        value={workID}
                        onChange={handleWorkIdChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Date Hired "
                        id="datehired"
                        type="date"
                        value={dateHired}
                        onChange={handleDateHiredChange}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                          // Add a pattern to enforce the format MM/DD/YY
                          pattern:
                            "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="First Name"
                        id="fName"
                        value={firstname}
                        onChange={handleFNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        fullWidth
                        size="medium"
                        label="Middle Name"
                        id="mName"
                        value={middlename}
                        onChange={handleMNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Last Name"
                        id="lName"
                        value={lastname}
                        onChange={handleLNameChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8} sx={{ width: "100%" }}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Institutional Email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <FormControl fullWidth size="medium" required>
                        <InputLabel
                          id="GenderLabel"
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                          }}
                        >
                          Gender
                        </InputLabel>
                        <Select
                          required
                          labelId="GenderLabel"
                          id="GenderLabel"
                          value={gender}
                          label="gender"
                          onChange={handleGender}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"Female"}
                          >
                            Female
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"Male"}
                          >
                            Male
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"Other"}
                          >
                            Other
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Username"
                        id="username"
                        value={checkUsername}
                        onChange={handleCheckUsername}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                      {(isAvailable || isTaken) && (
                        <FormHelperText
                          style={{
                            color: isAvailable ? "green" : "red",
                          }}
                        >
                          {msgInfo}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <div style={{ position: "relative", width: "100%" }}>
                        <TextField
                          required
                          fullWidth
                          size="medium"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          InputLabelProps={{
                            style: {
                              fontFamily: "Poppins",
                            },
                          }}
                          inputProps={{
                            style: {
                              fontSize: "16px",
                              fontFamily: "Poppins",
                            },
                          }}
                          onChange={handlePassword}
                        />
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          onClick={handleShowPassword}
                          style={{
                            color: "#636E72",
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <TextField
                        fullWidth
                        size="medium"
                        label="ConfirmPassword"
                        type="password"
                        id="confirmpassword"
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                      />
                      {isNotEmpty && (
                        <FormHelperText
                          style={{
                            color:
                              password !== confirmPassword ? "red" : "green",
                          }}
                        >
                          {password !== confirmPassword
                            ? "Passwords do not match"
                            : "Passwords match"}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6} sx={{ width: "100%" }}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Position"
                        id="position"
                        value={position}
                        onChange={handlePositionChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "16px",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <FormControl required fullWidth size="medium">
                        <InputLabel
                          id="deptLabel"
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                          }}
                        >
                          Department
                        </InputLabel>
                        <Select
                          required
                          labelId="deptLabel"
                          id="dept"
                          value={dept}
                          label="dept"
                          onChange={handledept}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxWidth: "350px",
                              },
                            },
                          }}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          {departments.map((dept, index) => {
                            return (
                              <MenuItem
                                key={index}
                                style={{ fontFamily: "Poppins" }}
                                value={dept.deptName}
                                sx={{
                                  fontFamily: "Poppins",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "300px",
                                }}
                              >
                                {dept.deptName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box >
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Institutional Email"
                        id="email"
                        value={`${firstname}.${lastname}@.cit.edu`}
                        onChange={handleEmailChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                      {(emailIsTaken) && (
                        <FormHelperText
                          style={{
                            color:"red",
                          }}
                        >
                          {emailMsgInfo}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <TextField
                        required
                        fullWidth
                        size="medium"
                        label="Username"
                        id="username"
                        value={`${firstname}.${lastname}`}
                        onChange={handleCheckUsername}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                      {(isTaken) && (
                        <FormHelperText
                          style={{
                            color:  "red",
                          }}
                        >
                          {msgInfo}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <div style={{ position: "relative" }}>
                        <TextField
                          required
                          fullWidth
                          size="medium"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          InputLabelProps={{
                            style: {
                              fontFamily: "Poppins",
                            },
                          }}
                          inputProps={{
                            style: {
                              fontSize: "1em",
                              fontFamily: "Poppins",
                            },
                          }}
                          onChange={handlePassword}
                        />
                        <FontAwesomeIcon
                         
                          onClick={handleShowPassword}
                          style={{
                            color: "#636E72",
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <TextField
                        fullWidth
                        size="medium"
                        label="ConfirmPassword"
                        type="password"
                        id="confirmpassword"
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                      />
                      {isNotEmpty && (
                        <FormHelperText
                          style={{
                            color:
                              password !== confirmPassword ? "red" : "green",
                          }}
                        >
                          {password !== confirmPassword
                            ? "Passwords do not match"
                            : "Passwords match"}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "left",
              ml: "1.3vh",
            }}
          >
            <Button
              type="submit"
              sx={{
                bgcolor: "#8c383e",
                color: "white",
                width: "96.5%",
                "&:hover": {
                  backgroundColor: "#F8C702",
                  color: "black",
                },
                display: role ? "block " : "none",
              }}
              style={{
                textTransform: "none",
                fontFamily: "Poppins",
              }}
            >
              Create Account
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* {POP up for edit} */}
      <Dialog
        open={openEditDialog}
        onAbort={handleClickCloseBtn}
        sx={{
          "@media (min-width: 600px)": {
            width: "100vw",
          },
        }}
      >
        <form onSubmit={(e) => handleEditUserSave(e, selectedUser)}>
          <Box
            sx={{
              bgcolor: "#8c383e",
              height: "4vh",
              width: "100%",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Grid container spacing={0.6}>
              <Grid item xs={12} sx={{ height: "4.5vh" }}>
                <Grid
                  container
                  spacing={0.5}
                  sx={{
                    padding: "4px 0 6px 0",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    alignItems: "center", // Align items vertically
                  }}
                >
                  <Grid item sx={{ height: "4.1vh" }}>
                    <EditNoteTwoToneIcon
                      sx={{ color: "white", fontSize: "35px", ml: 1, mt: 0.3 }}
                    />
                  </Grid>
                  <Grid item sx={{ fontSize: "18px" }}>
                    Edit User Details
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <IconButton
              onClick={handleClickCloseBtn}
              sx={{
                "&:hover": {
                  color: "#F8C702",
                },
              }}
            >
              <HighlightOffOutlinedIcon
                sx={{ fontSize: "35px", color: "white" }}
              />
            </IconButton>
          </Box>
          <DialogContent>
            <Grid
              container
              spacing={0.6}
              sx={{
                display: "flex",
                justifyContent: "left",
                width: "100%",
                fontFamily: "Poppins",
              }}
            >
              {selectedUser?.role === "ADMIN" && (
                <>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} height="100%">
                      <TextField
                        fullWidth
                        size="medium"
                        label="First Name"
                        id="fName"
                        name="fName"
                        value={selectedUser.fName}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }}>
                      <TextField
                        fullWidth
                        size="medium"
                        label="Middle Name"
                        id="mName"
                        name="mName"
                        value={selectedUser.mName}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ fontFamily: "Poppins" }} >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Last Name"
                        id="lName"
                        value={selectedUser.lName}
                        name="lName"
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Id Number"
                        id="workId"
                        name="workID"
                        value={selectedUser.workID}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Admin Username"
                        id="username"
                        name="username"
                        value={selectedUser.username}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Institutional Email"
                        id="email"
                        name="workEmail"
                        value={selectedUser.workEmail}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </>
              )}
              {(selectedUser?.role === "EMPLOYEE" ||
                selectedUser?.role === "HEAD") && (
                <>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box>
                      <FormControl
                        fullWidth
                        size="medium"
                        disabled={selectedUser?.empStatus === "Regular"}
                      >
                        <InputLabel
                          id="employementStatusLabel"
                          sx={{
                            fontSize: ".9em",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employment Status
                        </InputLabel>
                        <Select
                          labelId="employementStatusLabel"
                          id="employementStatus"
                          name="empStatus"
                          value={selectedUser.empStatus}
                          label="employment status"
                          onChange={handleUserDataChange}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value="Probationary"
                          >
                            Probationary
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value="Regular"
                          >
                            Regular
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box>
                      <FormControl
                        fullWidth
                        size="medium"
                        disabled={selectedUser?.empStatus === "Regular"}
                      >
                        <InputLabel
                          id="probationaryStatus"
                          sx={{
                            fontSize: ".9em",
                            fontFamily: "Poppins",
                          }}
                        >
                          Probationary Status
                        </InputLabel>
                        <Select
                          labelId="probationaryStatusLabel"
                          id="probeStat"
                          name="probeStatus"
                          value={selectedUser.probeStatus}
                          label="probationary status"
                          onChange={handleUserDataChange}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"3rd Probationary"}
                          >
                            3rd Probationary
                          </MenuItem>
                          <MenuItem
                            style={{ fontFamily: "Poppins" }}
                            value={"5th Probationary"}
                          >
                            5th Probationary
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        bgcolor:
                          empStatus == "Regular" ? "inherit" : "transparent",
                      }}
                    >
                      <TextField
                        fullWidth
                        disabled
                        size="medium"
                        label="Date Started "
                        id="dateStarted"
                        type="date"
                        name="dateStarted"
                        value={selectedUser.dateStarted}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                          // Add a pattern to enforce the format MM/DD/YY
                          pattern:
                            "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8} sx={{ width: "100%" }}>
                    <Box sx={{ height: "100%" }}>
                      <TextField
                        fullWidth
                        size="medium"
                        label="Employee ID"
                        id="workId"
                        name="workID"
                        value={selectedUser.workID}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4} >
                    <Box>
                      <TextField
                        fullWidth
                        disabled
                        size="medium"
                        label="Date Hired "
                        id="datehired"
                        type="date"
                        name="dateHired"
                        value={selectedUser.dateHired}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                          // Add a pattern to enforce the format MM/DD/YY
                          pattern:
                            "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={2.3}>
                    <Box>
                      <FormControl fullWidth size="medium" disabled>
                        <InputLabel
                          id="GenderLabel"
                          value={gender}
                          sx={{
                            fontSize: ".9em",
                            fontFamily: "Poppins",
                          }}
                        >
                          Gender
                        </InputLabel>
                        <Select
                          labelId="GenderLabel"
                          id="GenderLabel"
                          value={selectedUser.gender}
                          label="gender"
                          name="gender"
                          onChange={handleUserDataChange}
                        >
                          <MenuItem value={"Female"}>Female</MenuItem>
                          <MenuItem value={"Male"}>Male</MenuItem>
                          <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={6} >
                    <Box >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Position"
                        id="position"
                        name="position"
                        value={selectedUser.position}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <FormControl fullWidth size="medium">
                        <InputLabel
                          id="deptLabel"
                          sx={{
                            fontSize: ".9em",
                            fontFamily: "Poppins",
                          }}
                        >
                          Department
                        </InputLabel>
                        <Select
                          labelId="deptLabel"
                          name="dept"
                          id="dept"
                          value={selectedUser.dept}
                          label="dept"
                          onChange={handleUserDataChange}
                          sx={{ fontFamily: "Poppins" }}
                        >
                          {departments.map((dept, index) => {
                            return (
                              <MenuItem
                                key={index}
                                style={{ fontFamily: "Poppins" }}
                                value={dept.deptName}
                                sx={{
                                  fontFamily: "Poppins",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "300px",
                                }}
                              >
                                {dept.deptName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={6} >
                    <Box >
                      <TextField
                        fullWidth
                        size="medium"
                        label="Institutional Email"
                        id="email"
                        name="workEmail"
                        value={selectedUser.workEmail}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <TextField
                        fullWidth
                        size="medium"
                        label="Username"
                        id="username"
                        name="username"
                        value={selectedUser.username}
                        onChange={handleUserDataChange}
                        InputLabelProps={{
                          style: {
                            fontFamily: "Poppins",
                          },
                        }}
                        inputProps={{
                          style: {
                            fontSize: "1em",
                            fontFamily: "Poppins",
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "rgba(248, 199, 2, 0.9)",
                fontFamily: "Poppins",
                color: "black",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                  color: "black",
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* pop up DELETE */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleClickCloseBtn}

      >
        <Box
          sx={{
            bgcolor: "#8c383e",
            height: "2.79em",
            width: "100%",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Grid
                container
                spacing={0.6}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "transparent",
                  alignItems: "center", // Align items vertically
                }}
              >
                <Grid item sx={{ height: "3.3em" }}>
                  <DeleteOutlineIcon
                    sx={{ color: "white", fontSize: "1.5em", ml: 1, mt: 1.3}}
                  />
                </Grid>
                <Grid item sx={{ fontSize: "1.1em" }}>
                  Delete User Account
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <IconButton
            onClick={handleClickCloseBtn}
            sx={{
              "&:hover": {
                color: "#F8C702",
              },
            }}
          >
            <HighlightOffOutlinedIcon
              sx={{ fontSize: "1.4em", color: "white" }}
            />
          </IconButton>
        </Box>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: "Poppins",
              color: "black",
              display: "flex",
              justifyContent: "center",
              mt: "1.3em",
            }}
          >
            Are you sure you want to delete this user account?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => handleYesDelBtn(selectedUser.userID)}
            variant="contained"
            sx={{
              fontFamily: "Poppins",
              bgcolor: "rgba(248, 199, 2, 0.9)",

              color: "black",
              "&:hover": {
                bgcolor: "#e0e0e0",
                color: "black",
              },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={handleClickCloseBtn}
            variant="contained"
            sx={{
              fontFamily: "Poppins",
              bgcolor: "#8c383e",
              ml: "1em",
              "&:hover": {
                bgcolor: "#e0e0e0",
                color: "black",
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <CustomAlert
        open={successAlert.open}
        onClose={() => setSuccessAlert({ ...successAlert, open: false })}
        severity="success"
        message={successAlert.message}
      />

      {/* Render error alert */}
      <CustomAlert
        open={errorAlert.open}
        onClose={() => setErrorAlert({ ...errorAlert, open: false })}
        severity="error"
        message={errorAlert.message}
      />
    </div>
  );
}
export default ManageAccount;
