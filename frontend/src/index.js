import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./error-page";
import Home from "./components/Home";
import CourseReviewForm from "./components/CourseReviewForm";
import SearchBar from "./components/SearchBar";
import Admin from "./components/Admin";
import Review from "./components/Review";
import SemesterTable from "./components/SemesterTable";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <SearchBar />,
      },
    ],
  },
  {
    path: "review-course",
    element: <CourseReviewForm />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
  {
    path: "search-review",
    element: <Review />,
  },
  {
    path: "test",
    element: <SemesterTable />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
