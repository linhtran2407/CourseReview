import React from "react";
import { Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";

function CourseReviewForm() {

    const backendPrefix = "http://localhost:8000/api/v1/";

    const [formData, setFormData] = useState({
        courseTitle: '',
        semester: 'Spring 2023',
        difficulty: '',
        recMajor: ''
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await axios.post(`${backendPrefix}review/course`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        
        
        if (res.status !== 200 || !res.data) {
          console.error("error saving course review");
          return;
        }

        console.log(res.data);
      };
    
      const handleChange = (e) => {
        const name = e.target.id;
        let value = e.target.value;
        if (e.target.type === 'number') {
          value = Number(value); // Convert to number
        }
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="courseTitle">
        <Form.Label>Course Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter course title"
          value={formData.courseTitle}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="semester">
        <Form.Label>Semester</Form.Label>
        <Form.Control
          as="select"
          value={formData.semester}
          onChange={handleChange}
          required
        >
          <option value={`Spring ${new Date().getFullYear()}`}>Spring {new Date().getFullYear()}</option>
          <option value={`Fall ${new Date().getFullYear() - 1}`}>Fall {new Date().getFullYear() - 1}</option>
          <option value={`Spring ${new Date().getFullYear() - 1}`}>Spring {new Date().getFullYear() - 1}</option>
          <option value={`Fall ${new Date().getFullYear() - 2}`}>Fall {new Date().getFullYear() - 2}</option>
          <option value={`Spring ${new Date().getFullYear() - 2}`}>Spring {new Date().getFullYear() - 2}</option>
          <option value={`Fall ${new Date().getFullYear() - 3}`}>Fall {new Date().getFullYear() - 3}</option>
          <option value={`Spring ${new Date().getFullYear() - 3}`}>Spring {new Date().getFullYear() - 2}</option>
          <option value={`Fall ${new Date().getFullYear() - 4}`}>Fall {new Date().getFullYear() - 3}</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="difficulty">
        <Form.Label>Difficulty</Form.Label>
        <Form.Control
          type="number"
          value={formData.difficulty}
          min={1}
          max={5}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="recMajor">
        <Form.Label>Recommended Major</Form.Label>
        <Form.Control
          type="number"
          value={formData.recMajor}
          min={1}
          max={5}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default CourseReviewForm;


    // courseTitle: { type: String, required: true },
// courseID: { type: String, required: true, unique: true },
// semester: { type: String, required: true },
// instructor: { type: String, required: true },
// courseQuality: { type: Number, required: true },
// instructorQuality: { type: Number, required: true },
// difficulty: { type: Number, required: true },
// workRequired: { type: Number, required: true },
// amountLearned: { type: Number, required: true },
// recMajor: { type: Number },
// recMinor: { type: Number },
// readingValues: { type: Number },