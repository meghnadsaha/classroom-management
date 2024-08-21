"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../src/axiosConfig";
import CreateClassroom from "../components/CreateClassroom";

const PrincipalDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [assigningStudent, setAssigningStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");

  // Function to fetch data
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [teachersResponse, studentsResponse, classroomsResponse] =
        await Promise.all([
          axiosInstance.get("/principal/teachers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/principal/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/principal/classrooms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setTeachers(teachersResponse.data);
      setStudents(studentsResponse.data);
      setClassrooms(classroomsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignClassroom = async () => {
    setAssigning(true);
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.post(
        "/principal/assign-teacher",
        {
          teacherId: selectedTeacher,
          classroomId: selectedClassroom,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Classroom assigned successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error assigning classroom:", error);
      alert("Failed to assign classroom");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignStudent = async () => {
    setAssigningStudent(true);
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.post(
        "/principal/assign-student",
        {
          studentId: selectedStudent,
          classroomId: selectedClassroom,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Student assigned successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error assigning student:", error);
      alert("Failed to assign student");
    } finally {
      setAssigningStudent(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(
        `/principal/students/${editingStudent._id}`,
        { email: newStudentEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Student updated successfully");
      setEditingStudent(null);
      setNewStudentEmail("");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student");
    }
  };

  const handleUpdateTeacher = async () => {
    if (!editingTeacher) return;

    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(
        `/principal/teachers/${editingTeacher._id}`,
        { email: newTeacherEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Teacher updated successfully");
      setEditingTeacher(null);
      setNewTeacherEmail("");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher");
    }
  };

  const handleDeleteStudent = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/principal/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student deleted successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const handleDeleteTeacher = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/principal/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Teacher deleted successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={4}>
      {/* Quick Stats */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Total Teachers</Typography>
            <Typography variant="h2">{teachers.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Total Students</Typography>
            <Typography variant="h2">{students.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Total Classrooms</Typography>
            <Typography variant="h2">{classrooms.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Create Classroom */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Create a New Classroom
        </Typography>
        <CreateClassroom />
      </Grid>

      {/* Assign Classroom to Teacher */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Assign Classroom to Teacher
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-teacher-label">Select Teacher</InputLabel>
          <Select
            labelId="select-teacher-label"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            label="Select Teacher"
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-classroom-label">Select Classroom</InputLabel>
          <Select
            labelId="select-classroom-label"
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            label="Select Classroom"
          >
            {classrooms.map((classroom) => (
              <MenuItem key={classroom._id} value={classroom._id}>
                {classroom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignClassroom}
          disabled={assigning}
        >
          {assigning ? "Assigning..." : "Assign Classroom"}
        </Button>
      </Grid>

      {/* Assign Student to Classroom */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Assign Student to Classroom
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-student-label">Select Student</InputLabel>
          <Select
            labelId="select-student-label"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            label="Select Student"
          >
            {students.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {student.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-classroom-student-label">Select Classroom</InputLabel>
          <Select
            labelId="select-classroom-student-label"
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            label="Select Classroom"
          >
            {classrooms.map((classroom) => (
              <MenuItem key={classroom._id} value={classroom._id}>
                {classroom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignStudent}
          disabled={assigningStudent}
        >
          {assigningStudent ? "Assigning..." : "Assign Student"}
        </Button>
      </Grid>

      {/* Teachers List */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Teachers
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Classroom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>
                    {editingTeacher?._id === teacher._id ? (
                      <TextField
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                      />
                    ) : (
                      teacher.email
                    )}
                  </TableCell>
                  <TableCell>
                    {classrooms.find(c => c._id === teacher.classroom)?.
                      name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {editingTeacher?._id === teacher._id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateTeacher}
                      >
                        Update
                      </Button>
                    ) : (
                      <IconButton
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setNewTeacherEmail(teacher.email);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteTeacher(teacher._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Students List */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Students
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Classroom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>
                    {editingStudent?._id === student._id ? (
                      <TextField
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                      />
                    ) : (
                      student.email
                    )}
                  </TableCell>
                  <TableCell>
                    {classrooms.find(c => c._id === student.classroom)?.
                      name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {editingStudent?._id === student._id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateStudent}
                      >
                        Update
                      </Button>
                    ) : (
                      <IconButton
                        onClick={() => {
                          setEditingStudent(student);
                          setNewStudentEmail(student.email);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default PrincipalDashboard;
