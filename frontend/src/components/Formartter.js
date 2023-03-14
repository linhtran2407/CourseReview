export function shortToLongSemester(semester) {
  if (!semester) return "";
  const season = semester.startsWith("s") ? "Spring" : "Fall";
  const year = semester.slice(1);
  return `${season} 20${year}`;
}

export function fullCourseName (courseTitle, courseNumber, institution) {
  const institutionInitial = institution.slice(0, 1).toUpperCase();
  const title = `${institutionInitial}${courseNumber} - ${courseTitle}`;
  return title;
}

export function instructorNameEmail (name, email) {
    return `${name} - ${email}`;
}