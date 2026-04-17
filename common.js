const STORAGE_KEY = "registeredUsers";
const LOGGED_IN_KEY = "loggedInUser";
const REQUESTS_KEY = "leaveRequests";
const PASSWORD_CHANGE_REQUESTS_KEY = "passwordChangeRequests";
const ADMIN_EMAILS = ["admin@company.com", "manager@company.com"];

function isAdminEmail(emailValue) {
  return ADMIN_EMAILS.includes((emailValue || "").trim().toLowerCase());
}

function getRegisteredUsers() {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

function saveRegisteredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getLeaveRequests() {
  const requests = localStorage.getItem(REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
}

function saveLeaveRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function getPasswordChangeRequests() {
  const requests = localStorage.getItem(PASSWORD_CHANGE_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
}

function savePasswordChangeRequests(requests) {
  localStorage.setItem(PASSWORD_CHANGE_REQUESTS_KEY, JSON.stringify(requests));
}

function emailExists(emailValue) {
  const cleanedEmail = (emailValue || "").trim().toLowerCase();
  return getRegisteredUsers().some(
    (user) => (user.email || "").trim().toLowerCase() === cleanedEmail
  );
}

function phoneNumberExists(phoneNumberValue) {
  const cleanedValue = (phoneNumberValue || "").replace(/\s+/g, "");
  return getRegisteredUsers().some(
    (user) => (user.phoneNumber || "").replace(/\s+/g, "") === cleanedValue
  );
}

function findUserByEmail(emailValue) {
  const cleanedEmail = (emailValue || "").trim().toLowerCase();
  return getRegisteredUsers().find(
    (user) => (user.email || "").trim().toLowerCase() === cleanedEmail
  );
}

function setError(input, message) {
  const field = input.parentElement;
  field.classList.remove("success");
  field.classList.add("error");
  field.querySelector(".message").textContent = message;
}

function setSuccess(input, message = "") {
  const field = input.parentElement;
  field.classList.remove("error");
  field.classList.add("success");
  field.querySelector(".message").textContent = message;
}

function clearFieldState(field) {
  field.classList.remove("success");
  field.classList.remove("error");
  field.querySelector(".message").textContent = "";
}

function isValidPhoneNumber(value) {
  const cleaned = (value || "").replace(/\s+/g, "");
  return /^(?:\+61|0)(?:[2378]\d{8}|4\d{8})$/.test(cleaned);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}