import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./error-page";
import Home from "./components/Home";
import CourseReviewForm from "./components/CourseReviewForm";
import Admin from "./components/Admin";
import Review from "./components/Review";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
