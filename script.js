// Shared data
let courses = JSON.parse(localStorage.getItem("courses")) || [];
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Login Page Logic
if (window.location.pathname.includes("index.html")) {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const role = document.getElementById("role").value;

    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "student") {
      window.location.href = "student.html";
    } else if (role === "teacher") {
      window.location.href = "teacher.html";
    }
  });
}

// Admin Page Logic
if (window.location.pathname.includes("admin.html")) {
  const courseForm = document.getElementById("courseForm");
  const subjectForm = document.getElementById("subjectForm");
  const courseList = document.getElementById("courseList");
  const subjectList = document.getElementById("subjectList");

  courseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const courseName = document.getElementById("courseName").value;
    courses.push(courseName);
    localStorage.setItem("courses", JSON.stringify(courses));
    displayList(courses, courseList);
    courseForm.reset();
    updateSummary();
  });

  subjectForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const subjectName = document.getElementById("subjectName").value;
    subjects.push(subjectName);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    displayList(subjects, subjectList);
    subjectForm.reset();
    updateSummary();
  });

  function displayList(data, container) {
    container.innerHTML = "";
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function updateSummary() {
    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("totalSubjects").textContent = subjects.length;
    document.getElementById("totalApplications").textContent = applications.length;

    const approved = applications.filter(app => app.status === "Approved").length;
    const pending = applications.filter(app => app.status === "Pending").length;

    document.getElementById("approvedApps").textContent = approved;
    document.getElementById("pendingApps").textContent = pending;
  }

  displayList(courses, courseList);
  displayList(subjects, subjectList);
  updateSummary();
}

// Student Page Logic
if (window.location.pathname.includes("student.html")) {
  const courseSelect = document.getElementById("courseSelect");
  const availableCourses = document.getElementById("availableCourses");
  const applyForm = document.getElementById("applyForm");
  const applyMsg = document.getElementById("applyMsg");

  function loadCourses() {
    courseSelect.innerHTML = '<option value="" disabled selected>Select a course</option>';
    availableCourses.innerHTML = '';
    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);

      const li = document.createElement("li");
      li.textContent = course;
      availableCourses.appendChild(li);
    });
  }

  applyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const studentName = document.getElementById("studentName").value;
    const selectedCourse = document.getElementById("courseSelect").value;

    applications.push({
      student: studentName,
      course: selectedCourse,
      status: "Pending",
      assignedSubject: null
    });

    localStorage.setItem("applications", JSON.stringify(applications));
    applyMsg.textContent = "Application submitted successfully!";
    applyForm.reset();
  });

  loadCourses();
}

// Teacher Page Logic
if (window.location.pathname.includes("teacher.html")) {
  const applicationList = document.getElementById("applicationList");

  function loadApplications() {
    applicationList.innerHTML = "";
    applications.forEach((app, index) => {
      if (app.status === "Pending") {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${app.student}</strong> applied for <strong>${app.course}</strong><br>
          <label>Select Subject:</label>
          <select id="subjectSelect-${index}">
            ${subjects.map(sub => `<option value="${sub}">${sub}</option>`).join("")}
          </select>
          <button onclick="approveApplication(${index})">Approve</button>
        `;
        applicationList.appendChild(li);
      }
    });
  }

  window.approveApplication = function (index) {
    const selectedSubject = document.getElementById(`subjectSelect-${index}`).value;
    applications[index].status = "Approved";
    applications[index].assignedSubject = selectedSubject;

    localStorage.setItem("applications", JSON.stringify(applications));
    loadApplications();
  };

  loadApplications();
}
