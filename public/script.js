// Add a new student
const studentForm = document.getElementById('studentForm');
if (studentForm) {
  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      studentId: document.getElementById('studentId').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      city: document.getElementById('city').value,
      course: document.getElementById('course').value,
      guardian: document.getElementById('guardian').value,
      subject: document.getElementById('subject').value,
    };

    fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        studentForm.reset();
      })
      .catch((error) => console.error('Error:', error));
  });
}

// Display students on the index page
const studentTable = document.getElementById('studentTable');
if (studentTable) {
  fetch('/students')
    .then((response) => response.json())
    .then((students) => {
      const tbody = studentTable.querySelector('tbody');
      students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.studentId}</td>
          <td>${student.firstName}</td>
          <td>${student.lastName}</td>
          <td>${student.email}</td>
          <td>${student.city}</td>
          <td>${student.course}</td>
          <td>${student.guardian}</td>
          <td>${student.subject}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error('Error:', error));
}

//darkmode
const toggle = document.getElementById("dark-mode-toggle");
      const body = document.body;

      // Check localStorage for dark mode preference
      if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("bg-dark", "text-light");
        toggle.textContent = "🌞 Light Mode";
      }

      toggle.addEventListener("click", () => {
        const isDarkModeEnabled = body.classList.toggle("bg-dark");
        body.classList.toggle("text-light");

        if (isDarkModeEnabled) {
          toggle.textContent = "🌞 Light Mode";
          localStorage.setItem("dark-mode", "enabled");
        } else {
          toggle.textContent = "🌙 Dark Mode";
          localStorage.setItem("dark-mode", "disabled");
        }
      } 
);

//Delete Student record
document.getElementById('deleteForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const studentId = document.getElementById('studentId').value.trim();

  if (!studentId) {
    Swal.fire({
      title: 'Error',
      text: 'Please enter a valid Student ID.',
      icon: 'error',
    });
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete the student record with ID: ${studentId}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/students/delete/${studentId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          console.log(`Response Status: ${response.status}`);
          if (!response.ok) {
            throw new Error('Failed to delete the record');
          }
          return response.json();
        })
        .then((result) => {
          console.log('Delete Result:', result);
          Swal.fire({
            title: 'Deleted!',
            text: 'The student record has been successfully deleted.',
            icon: 'success',
          });
          document.getElementById('deleteForm').reset();
        })
        .catch((error) => {
          console.error('Error:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting the record. Check console for details.',
            icon: 'error',
          });
        });
    }
  });
});