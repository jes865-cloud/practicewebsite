const leaveForm = document.getElementById("leaveForm");

if (leaveForm) {
  const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
  const welcomeText = document.getElementById("welcomeText");
  const leaveType = document.getElementById("leaveType");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const reason = document.getElementById("reason");
  const requestList = document.getElementById("requestList");
  const logoutBtn = document.getElementById("logoutBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const certificateField = document.getElementById("certificateField");
  const doctorCertificate = document.getElementById("doctorCertificate");
  const leaveHint = document.getElementById("leaveHint");
  const reasonCount = document.getElementById("reasonCount");
  const summaryType = document.getElementById("summaryType");
  const summaryDates = document.getElementById("summaryDates");
  const summaryDays = document.getElementById("summaryDays");
  const formNotice = document.getElementById("formNotice");

  if (!loggedInUser) {
    window.location.href = "login.html";
  } else {
    welcomeText.textContent = `Welcome, ${loggedInUser.fullName}.`;
  }

  function validateLeaveType() {
    if (leaveType.value === "") {
      setError(leaveType, "Please select a leave type.");
      return false;
    }

    setSuccess(leaveType);
    return true;
  }

  function validateStartDate() {
    if (startDate.value === "") {
      setError(startDate, "Start date is required.");
      return false;
    }

    setSuccess(startDate);
    return true;
  }

  function validateEndDate() {
    if (endDate.value === "") {
      setError(endDate, "End date is required.");
      return false;
    }

    if (startDate.value !== "" && endDate.value < startDate.value) {
      setError(endDate, "End date cannot be before start date.");
      return false;
    }

    setSuccess(endDate);
    return true;
  }

  function validateReason() {
    const text = reason.value.trim();

    if (text === "") {
      setError(reason, "Reason is required.");
      return false;
    }

    if (text.length < 5) {
      setError(reason, "Reason must be at least 5 characters.");
      return false;
    }

    if (text.length > 250) {
      setError(reason, "Reason must be 250 characters or fewer.");
      return false;
    }

    setSuccess(reason);
    return true;
  }

  function toggleCertificateField() {
    if (!certificateField || !doctorCertificate) {
      return;
    }

    if (leaveType.value === "Sick Leave") {
      certificateField.style.display = "block";
    } else {
      certificateField.style.display = "none";
      doctorCertificate.value = "";
      clearFieldState(certificateField);
    }
  }

  function validateDoctorCertificate() {
    if (!doctorCertificate) {
      return true;
    }

    if (leaveType.value === "Sick Leave" && doctorCertificate.files.length === 0) {
      setError(doctorCertificate, "Please attach a doctor certificate for sick leave.");
      return false;
    }

    if (leaveType.value === "Sick Leave") {
      setSuccess(doctorCertificate, "Certificate attached.");
    }

    return true;
  }

  function updateLeaveHint() {
    if (!leaveHint) {
      return;
    }

    if (leaveType.value === "Sick Leave") {
      leaveHint.textContent = "Sick leave requires a doctor certificate attachment.";
    } else if (leaveType.value === "Annual Leave") {
      leaveHint.textContent = "Use annual leave for planned time away from work.";
    } else if (leaveType.value === "Personal Leave") {
      leaveHint.textContent = "Use personal leave for personal matters or responsibilities.";
    } else {
      leaveHint.textContent = "Choose the type of leave you are requesting.";
    }
  }

  function updateReasonCount() {
    if (!reasonCount) {
      return;
    }

    const length = reason.value.trim().length;
    reasonCount.textContent = `${length} / 250`;
  }

  function calculateLeaveDays() {
    if (!startDate.value || !endDate.value) {
      return 0;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (end < start) {
      return 0;
    }

    const diffMs = end - start;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  function updateSummary() {
    if (!summaryType || !summaryDates || !summaryDays) {
      return;
    }

    summaryType.textContent = `Leave type: ${leaveType.value || "Not selected"}`;

    if (startDate.value && endDate.value) {
      summaryDates.textContent = `Dates: ${startDate.value} to ${endDate.value}`;
    } else {
      summaryDates.textContent = "Dates: Not selected";
    }

    summaryDays.textContent = `Estimated days: ${calculateLeaveDays()}`;
  }

  function showFormNotice(message, type = "success") {
    if (!formNotice) {
      return;
    }

    formNotice.textContent = message;
    formNotice.className = `form-notice ${type}`;
    formNotice.style.display = "block";
  }

  function deleteRequest(storageIndex) {
    const confirmed = confirm("Are you sure you want to delete this request?");
    if (!confirmed) {
      return;
    }

    const allRequests = getLeaveRequests();
    allRequests.splice(storageIndex, 1);
    saveLeaveRequests(allRequests);
    renderRequests();
  }

  function renderRequests() {
    const allRequests = getLeaveRequests();
    const currentUserEmail = (loggedInUser.email || "").trim().toLowerCase();

    const userRequests = allRequests
      .map((request, index) => ({
        ...request,
        storageIndex: index
      }))
      .filter(
        (request) => (request.email || "").trim().toLowerCase() === currentUserEmail
      )
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    if (userRequests.length === 0) {
      requestList.innerHTML = "<p>No requests submitted yet.</p>";
      return;
    }

    requestList.innerHTML = userRequests
      .map(
        (request) => `
          <div class="request-item">
            <p><strong>Request ID:</strong> ${request.id ?? "N/A"}</p>
            <p><strong>Leave Type:</strong> ${request.leaveType}</p>
            <p><strong>Start Date:</strong> ${request.startDate}</p>
            <p><strong>End Date:</strong> ${request.endDate}</p>
            <p><strong>Reason:</strong> ${request.reason}</p>
            <p><strong>Certificate:</strong> ${request.certificateName || "Not attached"}</p>
            <p><strong>Status:</strong> ${request.status ?? "Submitted"}</p>
            <p><strong>Submitted:</strong> ${request.submittedAt ?? "N/A"}</p>
            <button type="button" class="delete-btn" data-index="${request.storageIndex}">
              Delete Request
            </button>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        deleteRequest(storageIndex);
      });
    });
  }

  function deleteCurrentUserAccount() {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This will also delete all of your requests and password change requests."
    );

    if (!confirmed) {
      return;
    }

    const currentUserEmail = (loggedInUser.email || "").trim().toLowerCase();

    const updatedUsers = getRegisteredUsers().filter(
      (user) => (user.email || "").trim().toLowerCase() !== currentUserEmail
    );

    const updatedRequests = getLeaveRequests().filter(
      (request) => (request.email || "").trim().toLowerCase() !== currentUserEmail
    );

    const updatedPasswordRequests = getPasswordChangeRequests().filter(
      (request) => (request.email || "").trim().toLowerCase() !== currentUserEmail
    );

    saveRegisteredUsers(updatedUsers);
    saveLeaveRequests(updatedRequests);
    savePasswordChangeRequests(updatedPasswordRequests);
    localStorage.removeItem(LOGGED_IN_KEY);

    window.location.href = "index.html";
  }

  leaveForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const leaveTypeValid = validateLeaveType();
    const startDateValid = validateStartDate();
    const endDateValid = validateEndDate();
    const reasonValid = validateReason();
    const certificateValid = validateDoctorCertificate();

    if (leaveTypeValid && startDateValid && endDateValid && reasonValid && certificateValid) {
      const requests = getLeaveRequests();

      const newRequest = {
        id: Date.now(),
        fullName: loggedInUser.fullName,
        email: loggedInUser.email,
        leaveType: leaveType.value,
        startDate: startDate.value,
        endDate: endDate.value,
        reason: reason.value.trim(),
        certificateName:
          doctorCertificate && doctorCertificate.files.length > 0
            ? doctorCertificate.files[0].name
            : "",
        status: "Submitted",
        submittedAt: new Date().toLocaleString()
      };

      requests.push(newRequest);
      saveLeaveRequests(requests);

      leaveForm.reset();

      document.querySelectorAll("#leaveForm .field").forEach((field) => {
        clearFieldState(field);
      });

      showFormNotice("Leave request submitted successfully.", "success");
      toggleCertificateField();
      updateLeaveHint();
      updateReasonCount();
      updateSummary();
      renderRequests();
    }
  });

  leaveType.addEventListener("blur", validateLeaveType);
  startDate.addEventListener("blur", validateStartDate);
  endDate.addEventListener("blur", validateEndDate);
  reason.addEventListener("blur", validateReason);

  leaveType.addEventListener("change", function () {
    toggleCertificateField();
    updateLeaveHint();
    updateSummary();
  });

  startDate.addEventListener("change", updateSummary);
  endDate.addEventListener("change", updateSummary);
  reason.addEventListener("input", updateReasonCount);

  if (doctorCertificate) {
    doctorCertificate.addEventListener("change", validateDoctorCertificate);
  }

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem(LOGGED_IN_KEY);
    window.location.href = "login.html";
  });

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", function () {
      deleteCurrentUserAccount();
    });
  }

  toggleCertificateField();
  updateLeaveHint();
  updateReasonCount();
  updateSummary();
  renderRequests();
}