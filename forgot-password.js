const passwordChangeRequestForm = document.getElementById("passwordChangeRequestForm");

if (passwordChangeRequestForm) {
  const requestEmail = document.getElementById("requestEmail");
  const requestPhoneNumber = document.getElementById("requestPhoneNumber");
  const newRequestedPassword = document.getElementById("newRequestedPassword");
  const confirmRequestedPassword = document.getElementById("confirmRequestedPassword");

  function validateRequestEmail() {
    const value = requestEmail.value.trim();

    if (value === "") {
      setError(requestEmail, "Email is required.");
      return false;
    }

    if (!isValidEmail(value)) {
      setError(requestEmail, "Please enter a valid email address.");
      return false;
    }

    const user = findUserByEmail(value);
    if (!user) {
      setError(requestEmail, "No account found with this email.");
      return false;
    }

    setSuccess(requestEmail);
    return true;
  }

  function validateRequestPhoneNumber() {
    const value = requestPhoneNumber.value.trim();

    if (value === "") {
      setError(requestPhoneNumber, "Phone number is required.");
      return false;
    }

    if (!isValidPhoneNumber(value)) {
      setError(requestPhoneNumber, "Please enter a valid Australian phone number.");
      return false;
    }

    const user = findUserByEmail(requestEmail.value.trim());

    if (
      user &&
      (user.phoneNumber || "").replace(/\s+/g, "") !== value.replace(/\s+/g, "")
    ) {
      setError(requestPhoneNumber, "Phone number does not match this account.");
      return false;
    }

    setSuccess(requestPhoneNumber);
    return true;
  }

  function validateRequestedPassword() {
    const value = newRequestedPassword.value;

    if (value === "") {
      setError(newRequestedPassword, "New password is required.");
      return false;
    }

    if (value.length < 8) {
      setError(newRequestedPassword, "Password must be at least 8 characters.");
      return false;
    }

    if (!/[A-Z]/.test(value)) {
      setError(newRequestedPassword, "Include at least one uppercase letter.");
      return false;
    }

    if (!/[0-9]/.test(value)) {
      setError(newRequestedPassword, "Include at least one number.");
      return false;
    }

    setSuccess(newRequestedPassword);
    return true;
  }

  function validateConfirmRequestedPassword() {
    const value = confirmRequestedPassword.value;

    if (value === "") {
      setError(confirmRequestedPassword, "Please confirm the new password.");
      return false;
    }

    if (value !== newRequestedPassword.value) {
      setError(confirmRequestedPassword, "Passwords do not match.");
      return false;
    }

    setSuccess(confirmRequestedPassword);
    return true;
  }

  passwordChangeRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailValid = validateRequestEmail();
    const phoneValid = validateRequestPhoneNumber();
    const passwordValid = validateRequestedPassword();
    const confirmValid = validateConfirmRequestedPassword();

    if (!emailValid || !phoneValid || !passwordValid || !confirmValid) {
      return;
    }

    const user = findUserByEmail(requestEmail.value.trim());
    const passwordRequests = getPasswordChangeRequests();

    const newPasswordRequest = {
      id: Date.now(),
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      newPassword: newRequestedPassword.value,
      status: "Pending",
      requestedAt: new Date().toLocaleString()
    };

    passwordRequests.push(newPasswordRequest);
    savePasswordChangeRequests(passwordRequests);

    alert("Password change request submitted successfully.");
    passwordChangeRequestForm.reset();

    document.querySelectorAll("#passwordChangeRequestForm .field").forEach((field) => {
      clearFieldState(field);
    });

    window.location.href = "login.html";
  });

  requestEmail.addEventListener("blur", validateRequestEmail);
  requestPhoneNumber.addEventListener("blur", validateRequestPhoneNumber);
  newRequestedPassword.addEventListener("blur", validateRequestedPassword);
  confirmRequestedPassword.addEventListener("blur", validateConfirmRequestedPassword);
}