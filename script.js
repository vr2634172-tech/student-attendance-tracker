const form = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const list = document.getElementById("studentList");
const emptyMessage = document.getElementById("emptyMessage");
let students = [];

try {
  students = JSON.parse(localStorage.getItem("attendanceStudents") || "[]");
  if (!Array.isArray(students)) students = [];
} catch {
  students = [];
}

function save() {
  localStorage.setItem("attendanceStudents", JSON.stringify(students));
}

function render() {
  list.replaceChildren();
  emptyMessage.hidden = students.length > 0;

  students.forEach((student) => {
    const item = document.createElement("li");
    item.className = "student";

    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = student.name;

    const presentButton = document.createElement("button");
    presentButton.className = "present";
    presentButton.textContent = student.status === "Present" ? "✓ Present" : "Mark Present";
    presentButton.setAttribute("aria-label", `Mark ${student.name} present`);
    presentButton.addEventListener("click", () => setStatus(student.id, "Present"));

    const absentButton = document.createElement("button");
    absentButton.className = "absent";
    absentButton.textContent = student.status === "Absent" ? "✓ Absent" : "Mark Absent";
    absentButton.setAttribute("aria-label", `Mark ${student.name} absent`);
    absentButton.addEventListener("click", () => setStatus(student.id, "Absent"));

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      students = students.filter((s) => s.id !== student.id);
      save();
      render();
    });

    item.append(name, presentButton, absentButton, removeButton);
    list.append(item);
  });

  const present = students.filter((s) => s.status === "Present").length;
  const absent = students.filter((s) => s.status === "Absent").length;
  document.getElementById("totalCount").textContent = students.length;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
  document.getElementById("percentage").textContent =
    students.length ? `${Math.round((present / students.length) * 100)}%` : "0%";
}

function setStatus(id, status) {
  students = students.map((s) => s.id === id ? { ...s, status } : s);
  save();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  students.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, status: "Absent" });
  nameInput.value = "";
  save();
  render();
  nameInput.focus();
});

document.getElementById("resetButton").addEventListener("click", () => {
  students = students.map((s) => ({ ...s, status: "Absent" }));
  save();
  render();
});

render();
