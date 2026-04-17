const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  function validateName() {
    const value = fullName.value.trim();

    if (value === "") {
      setError(fullName, "Full name is required.");
      return false;
    }

    if (value.length < 3) {
      setError(fullName, "Full name must be at least 3 characters.");
      return false;
    }

    setSuccess(fullName, "Looks good.");
    return true;
  }

  function validateEmail(checkDuplicate = false) {
    const value = email.value.trim();

    if (value === "") {
      setError(email, "Email is required.");
      return false;
    }

    if (!isValidEmail(value)) {
      setError(email, "Please enter a valid email address.");
      return false;
    }

    if (checkDuplicate && emailExists(value)) {
      setError(email, "This email is already registered. Please use a different email.");
      return false;
    }

    setSuccess(email, "Valid email.");
    return true;
  }

  function validatePhoneNumber(checkDuplicate = false) {
    const value = phoneNumber.value.trim();

    if (value === "") {
      setError(phoneNumber, "Phone number is required.");
      return false;
    }

    if (!isValidPhoneNumber(value)) {
      setError(phoneNumber, "Please enter a valid Australian phone number.");
      return false;
    }

    if (checkDuplicate && phoneNumberExists(value)) {
      setError(
        phoneNumber,
        "This phone number is already registered. Please use a different phone number."
      );
      return false;
    }

    setSuccess(phoneNumber, "Valid phone number.");
    return true;
  }

  function validatePassword() {
    const value = password.value;

    if (value === "") {
      setError(password, "Password is required.");
      return false;
    }

    if (value.length < 8) {
      setError(password, "Password must be at least 8 characters.");
      return false;
    }

    if (!/[A-Z]/.test(value)) {
      setError(password, "Include at least one uppercase letter.");
      return false;
    }

    if (!/[0-9]/.test(value)) {
      setError(password, "Include at least one number.");
      return false;
    }

    setSuccess(password, "Strong enough.");
    return true;
  }

  function validateConfirmPassword() {
    const value = confirmPassword.value;

    if (value === "") {
      setError(confirmPassword, "Please confirm your password.");
      return false;
    }

    if (value !== password.value) {
      setError(confirmPassword, "Passwords do not match.");
      return false;
    }

    setSuccess(confirmPassword, "Passwords match.");
    return true;
  }

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail(true);
    const phoneValid = validatePhoneNumber(true);
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();

    if (nameValid && emailValid && phoneValid && passwordValid && confirmPasswordValid) {
      const users = getRegisteredUsers();

      const newUser = {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        password: password.value
      };

      users.push(newUser);
      saveRegisteredUsers(users);

      localStorage.setItem("pendingSignupUser", JSON.stringify(newUser));
      window.location.href = "success.html";
    }
  });

  fullName.addEventListener("blur", validateName);
  email.addEventListener("blur", () => validateEmail(false));
  phoneNumber.addEventListener("blur", () => validatePhoneNumber(false));
  password.addEventListener("blur", validatePassword);
  confirmPassword.addEventListener("blur", validateConfirmPassword);
}