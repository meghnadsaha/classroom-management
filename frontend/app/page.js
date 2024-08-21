import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./components/NavBar";
import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <div>
      {/* <NavBar /> */}
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Classroom Management System
        </Typography>
        <Typography variant="h6" component="p" paragraph>
          Manage your classrooms, students, and teachers efficiently. Please
          log in to access the dashboard and other features.
        </Typography>
      </Container>
    </div>
  );
}
