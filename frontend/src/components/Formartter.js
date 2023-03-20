// convert semester to correct format in frontend
// eg: Fall 2021 <- f21, Spring 2023 <- s23
export function shortToLongSemester(semester) {
  if (!semester) return "";
  const season = semester.startsWith("s") ? "Spring" : "Fall";
  const year = semester.slice(1);
  return `${season} 20${year}`;
}

// convert semester to correct format in the DB
// eg: Fall 2021 -> f21, Spring 2023 -> s23
export function longToShortSemester(semester) {
  const [term, year] = semester.split(" ");
  const shortTerm = term.charAt(0).toLowerCase();
  const shortYear = year.slice(-2);
  return `${shortTerm}${shortYear}`;
}

export function fullCourseName(courseTitle, courseNumber, institution) {
  const institutionInitial = institution.slice(0, 1).toUpperCase();
  const title = `${institutionInitial}${courseNumber} - ${courseTitle}`;
  return title;
}

export function instructorNameEmail(name, email) {
  return `${name} - ${email}`;
}

export function showStatus(status) {
  return status === 0
    ? "pending"
    : status === 1
    ? "approved"
    : status === 2
    ? "rejected"
    : "";
}

export function getRatingDescription(rate, field) {
  if (field === "courseQuality" || field === "instructorQuality" || field === "instructorAccess") {
    switch (rate) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "Invalid rating";
    }
  } else if (field === "difficulty") {
    switch (rate) {
      case 1:
        return "Very Easy";
      case 2:
        return "Easy";
      case 3:
        return "Neutral";
      case 4:
        return "Difficult";
      case 5:
        return "Very Difficult";
      default:
        return "Invalid rating";
    }
  } else if (field === "workRequired" || field === "amountLearned" || field === "stimulateInterest") {
    switch (rate) {
      case 1:
        return "Very Little";
      case 2:
        return "Some";
      case 3:
        return "Moderate";
      case 4:
        return "A lot";
      case 5:
        return "A great deal";
      default:
        return "Invalid rating";
    }
  } else {
    switch (rate) {
      case 1:
        return "Very Unlikely";
      case 2:
        return "Unlikely";
      case 3:
        return "Neutral";
      case 4:
        return "Likely";
      case 5:
        return "Very Likely";
      default:
        return "Invalid rating";
    }
  }
}
