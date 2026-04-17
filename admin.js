const adminRequestList = document.getElementById("adminRequestList");

if (adminRequestList) {
  const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
  const adminWelcomeText = document.getElementById("adminWelcomeText");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminPasswordRequestList = document.getElementById("adminPasswordRequestList");

  if (!loggedInUser) {
    window.location.href = "login.html";
  } else if (!isAdminEmail(loggedInUser.email)) {
    window.location.href = "dashboard.html";
  } else {
    adminWelcomeText.textContent = `Welcome, ${loggedInUser.fullName}. You are logged in as an admin.`;
  }

  function updateRequestStatus(storageIndex, newStatus) {
    const allRequests = getLeaveRequests();

    if (allRequests[storageIndex]) {
      allRequests[storageIndex].status = newStatus;
      saveLeaveRequests(allRequests);
    }

    renderAdminRequests();
  }

  function deleteAdminRequest(storageIndex) {
    const confirmed = confirm("Are you sure you want to delete this request?");
    if (!confirmed) {
      return;
    }

    const allRequests = getLeaveRequests();
    allRequests.splice(storageIndex, 1);
    saveLeaveRequests(allRequests);
    renderAdminRequests();
  }

  function deleteUserAccount(userEmail) {
    const cleanedEmail = (userEmail || "").trim().toLowerCase();

    if (cleanedEmail === (loggedInUser.email || "").trim().toLowerCase()) {
      alert("You cannot delete your own admin account from this page.");
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete the account for ${userEmail}? This will also delete all of their requests and password change requests.`
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = getRegisteredUsers().filter(
      (user) => (user.email || "").trim().toLowerCase() !== cleanedEmail
    );

    const updatedRequests = getLeaveRequests().filter(
      (request) => (request.email || "").trim().toLowerCase() !== cleanedEmail
    );

    const updatedPasswordRequests = getPasswordChangeRequests().filter(
      (request) => (request.email || "").trim().toLowerCase() !== cleanedEmail
    );

    saveRegisteredUsers(updatedUsers);
    saveLeaveRequests(updatedRequests);
    savePasswordChangeRequests(updatedPasswordRequests);

    renderAdminRequests();
    renderAdminPasswordRequests();
  }

  function renderAdminRequests() {
    const allRequests = getLeaveRequests()
      .map((request, index) => ({
        ...request,
        storageIndex: index
      }))
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    if (allRequests.length === 0) {
      adminRequestList.innerHTML = "<p>No requests submitted yet.</p>";
      return;
    }

    adminRequestList.innerHTML = allRequests
      .map(
        (request) => `
          <div class="request-item">
            <p><strong>Request ID:</strong> ${request.id ?? "N/A"}</p>
            <p><strong>Name:</strong> ${request.fullName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Leave Type:</strong> ${request.leaveType}</p>
            <p><strong>Start Date:</strong> ${request.startDate}</p>
            <p><strong>End Date:</strong> ${request.endDate}</p>
            <p><strong>Reason:</strong> ${request.reason}</p>
            <p><strong>Certificate:</strong> ${request.certificateName || "Not attached"}</p>
            <p><strong>Status:</strong> ${request.status ?? "Submitted"}</p>
            <p><strong>Submitted:</strong> ${request.submittedAt ?? "N/A"}</p>

            <div class="admin-actions">
              <button type="button" class="approve-btn" data-index="${request.storageIndex}">
                Approve
              </button>
              <button type="button" class="reject-btn" data-index="${request.storageIndex}">
                Reject
              </button>
              <button type="button" class="delete-btn" data-index="${request.storageIndex}">
                Delete Request
              </button>
              <button type="button" class="delete-user-btn" data-email="${request.email}">
                Delete User
              </button>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".approve-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        updateRequestStatus(storageIndex, "Approved");
      });
    });

    document.querySelectorAll(".reject-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        updateRequestStatus(storageIndex, "Rejected");
      });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        deleteAdminRequest(storageIndex);
      });
    });

    document.querySelectorAll(".delete-user-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const userEmail = this.dataset.email;
        deleteUserAccount(userEmail);
      });
    });
  }

  function approvePasswordChangeRequest(storageIndex) {
    const passwordRequests = getPasswordChangeRequests();
    const request = passwordRequests[storageIndex];

    if (!request) {
      return;
    }

    const users = getRegisteredUsers();
    const updatedUsers = users.map((user) => {
      if (
        (user.email || "").trim().toLowerCase() ===
        (request.email || "").trim().toLowerCase()
      ) {
        return {
          ...user,
          password: request.newPassword
        };
      }
      return user;
    });

    saveRegisteredUsers(updatedUsers);

    passwordRequests[storageIndex].status = "Approved";
    savePasswordChangeRequests(passwordRequests);

    renderAdminPasswordRequests();
  }

  function rejectPasswordChangeRequest(storageIndex) {
    const passwordRequests = getPasswordChangeRequests();

    if (!passwordRequests[storageIndex]) {
      return;
    }

    passwordRequests[storageIndex].status = "Rejected";
    savePasswordChangeRequests(passwordRequests);

    renderAdminPasswordRequests();
  }

  function renderAdminPasswordRequests() {
    if (!adminPasswordRequestList) {
      return;
    }

    const passwordRequests = getPasswordChangeRequests()
      .map((request, index) => ({
        ...request,
        storageIndex: index
      }))
      .sort((a, b) => (b.id || 0) - (a.id || 0));

    if (passwordRequests.length === 0) {
      adminPasswordRequestList.innerHTML =
        "<p>No password change requests submitted yet.</p>";
      return;
    }

    adminPasswordRequestList.innerHTML = passwordRequests
      .map(
        (request) => `
          <div class="request-item">
            <p><strong>Request ID:</strong> ${request.id ?? "N/A"}</p>
            <p><strong>Name:</strong> ${request.fullName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Phone Number:</strong> ${request.phoneNumber}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            <p><strong>Requested:</strong> ${request.requestedAt ?? "N/A"}</p>

            <div class="admin-actions">
              <button type="button" class="approve-password-btn" data-index="${request.storageIndex}">
                Approve Password Change
              </button>
              <button type="button" class="reject-password-btn" data-index="${request.storageIndex}">
                Reject Password Change
              </button>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".approve-password-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        approvePasswordChangeRequest(storageIndex);
      });
    });

    document.querySelectorAll(".reject-password-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const storageIndex = Number(this.dataset.index);
        rejectPasswordChangeRequest(storageIndex);
      });
    });
  }

  adminLogoutBtn.addEventListener("click", function () {
    localStorage.removeItem(LOGGED_IN_KEY);
    window.location.href = "login.html";
  });

  renderAdminRequests();
  renderAdminPasswordRequests();
}