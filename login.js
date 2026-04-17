const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  function validateLoginEmail() {
    const value = loginEmail.value.trim();

    if (value === "") {
      setError(loginEmail, "Email is required.");
      return false;
    }

    if (!isValidEmail(value)) {
      setError(loginEmail, "Please enter a valid email address.");
      return false;
    }

    setSuccess(loginEmail);
    return true;
  }

  function validateLoginPassword() {
    const value = loginPassword.value;

    if (value === "") {
      setError(loginPassword, "Password is required.");
      return false;
    }

    setSuccess(loginPassword);
    return true;
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailValid = validateLoginEmail();
    const passwordValid = validateLoginPassword();

    if (!emailValid || !passwordValid) {
      return;
    }

    const user = findUserByEmail(loginEmail.value.trim());

    if (!user) {
      setError(loginEmail, "No account found with this email.");
      return;
    }

    if (user.password !== loginPassword.value) {
      setError(loginPassword, "Incorrect password.");
      return;
    }

    localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));

    if (isAdminEmail(user.email)) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  });

  loginEmail.addEventListener("blur", validateLoginEmail);
  loginPassword.addEventListener("blur", validateLoginPassword);
}