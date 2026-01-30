// 1. <-- Main Selectors -->

let reservePopup = document.getElementById("reserve-appointment-popup"),
    firstNameInp = document.getElementById("first-name-input"),
    lastNameInp = document.getElementById("last-name-input"),
    phoneNumberInp = document.getElementById("phone-number-input"),
    emailInp = document.getElementById("email-input"),
    reasonInp = document.getElementById("reason-input"),
    dateInp = document.getElementById("date-input"),
    tableBody = document.getElementById("table-body"),
    deletePopup = document.getElementById("delete-popup"),
    inputs = document.querySelectorAll("input"),
    paginationHolder = document.getElementById("pagination"),
    closeSearch = document.getElementById("close-search-btn"),
    searchInp = document.getElementById("search-inp");

// 2. <-- Main Variables -->

let appointmentsData = JSON.parse(localStorage.getItem("appointments")) || [],
    appointments = [],
    totalPages = 0,
    currentIndexToDelete,
    currentPage = 1,
    rowsPerPage = 5,
    theme = "light";

// 3. <-- Main Functions -->

const setDateInPage = () => {
    handlePagination();

    // Reset the Table
    tableBody.innerHTML = "";

    // Set Data in the Table
    if (appointments.length) {
        for (let [index, appointment] of appointments.entries()) {
            tableBody.innerHTML += `
            <tr
                class="secondary-bg text-color block w-full px-2 py-4 not-last:border-b not-last:border-[#ddd] hover:bg-[#eee] transition">
                <td class="w-[150px] text-center">
                    ${appointment.firstName}
                </td>
                <td class="w-[150px] text-center">
                    ${appointment.lastName}
                </td>
                <td class="w-[150px] text-center">
                    ${appointment.phoneNumber}
                </td>
                <td class="w-[150px] text-center" title="${appointment.email}">
                    ${
                        appointment.email.length <= 10
                            ? appointment.email
                            : appointment.email.slice(0, 10) + "..."
                    }
                </td>
                <td class="w-[150px] text-center" title="${appointment.reason}">
                    ${
                        appointment.reason.length <= 10
                            ? appointment.reason
                            : appointment.reason.slice(0, 10) + "..."
                    }
                </td>
                <td class="w-[150px] text-center">
                    ${appointment.date}
                </td>
                <td class="w-[150px] text-center cursor-pointer hover:text-[#F44336] transition" onclick="deleteIteamPopup(${index})">
                    <i class="ri-delete-bin-line"></i>
                </td>
            </tr>
        `;
        }
    } else {
        tableBody.innerHTML = `
            <tr class="block w-full">
                <td
                    class="block w-full text-[#888080] text-center p-4"
                >
                    There are no data to show!
                </td>
            </tr>
        `;
    }

    // Set Total Demands
    document.getElementById("total-demands").innerHTML = appointments.length;
};

const updateLocalstorage = () => {
    // Set Date in the Localstorage
    localStorage.setItem("appointments", JSON.stringify(appointmentsData));
};

const deleteIteamPopup = (index) => {
    // Show Delete Pop up
    deletePopup.classList.remove("hidden");

    // Set the
    currentIndexToDelete = index;
    // Cancel Delete
    document
        .getElementById("cancel-delete-btn")
        .addEventListener("click", () => {
            check = false;

            deletePopup.classList.add("hidden");
        });
};

const deleteItem = () => {
    // Remove the Targeted Appointment
    appointmentsData.splice(currentIndexToDelete, 1);

    // Update the Localstorage
    updateLocalstorage();

    // Update the Table in the Page
    setDateInPage();

    // Hide the Delete Pop up
    deletePopup.classList.add("hidden");
};

const showPopup = (type, msg) => {
    let popup = document.getElementById("popup");
    popup.classList.remove("hidden");

    if (type == "error") {
        popup.classList.add("bg-[#F44336]");
        popup.classList.remove("bg-[#4CAF50]");
    } else {
        popup.classList.add("bg-[#4CAF50]");
        popup.classList.remove("bg-[#F44336]");
    }

    popup.innerHTML = msg;

    setTimeout(() => popup.classList.add("hidden"), 3000);
};

const handlePagination = () => {
    // Get Total Pages
    if (appointmentsData.length % rowsPerPage == 0) {
        totalPages = appointmentsData.length / rowsPerPage;
    } else {
        totalPages = Math.ceil(appointmentsData.length / rowsPerPage);
    }

    // Set Pagination Controller in page
    handlePaginationControllers();

    // Set Total Pages in Page
    document.getElementById("total-pages").innerHTML = totalPages;

    // Slice Based on the Current Page
    let start = (currentPage - 1) * rowsPerPage,
        end = rowsPerPage * currentPage;

    appointments = appointmentsData.slice(start, end);
};

const handlePaginationControllers = () => {
    if (totalPages > 0) {
        // Set Pagination Controllers

        paginationHolder.innerHTML = "";

        // Set Controllers
        paginationHolder.innerHTML += `
            <button
                id="prev-nav"
                class="nav-btn w-[25px] h-[25px] text-[#888080] text-2xl cursor-pointer flex justify-center items-center ${
                    currentPage == 1 ? "disabled-btn" : ""
                }"
                onclick="paginationPevNavigation(this)"
            >
                <i class="ri-arrow-left-s-line"></i>
            </button>
            <div
                id="pagination-pages"
                class="flex items-center gap-1"
            ></div>
            <button
                id="next-nav"
                class="nav-btn w-[25px] h-[25px] text-[#888080] text-2xl cursor-pointer flex justify-center items-center ${
                    currentPage == totalPages ? "disabled-btn" : ""
                }"
                onclick="paginationNextNavigation(this)"
            >
                <i
                    class="ri-arrow-right-s-line"
                ></i>
            </button>
        `;

        // Set Pagination Pages
        for (let i = 1; i <= totalPages; i++) {
            document.getElementById("pagination-pages").innerHTML += `
            <button
                class="w-[30px] h-[30px] border border-[#D9D9D9] rounded-sm cursor-pointer ${
                    i == currentPage ? "active-page" : ""
                }"
                onclick="paginationPagesNavigation(this, ${i})"
            >
                ${i}
            </button>
        `;
        }
    }
};

const paginationPagesNavigation = (currentBtn, targetedPage) => {
    currentPage = targetedPage;

    // Remove Active Class From All Pagination Pages Buttons
    document
        .querySelectorAll("#pagination-pages button")
        .forEach((btn) => btn.classList.remove("active-page"));

    // Add Active Class on the Current Button
    currentBtn.classList.add("active-page");

    // Update Table
    setDateInPage();
};

const paginationPevNavigation = (btn) => {
    if (currentPage > 1) {
        currentPage--;

        if (btn.classList.contains("disabled-btn")) {
            btn.classList.remove("disabled-btn");
        }
    } else {
        btn.classList.add("disabled-btn");
    }

    // Update Table
    setDateInPage();
};

const paginationNextNavigation = (btn) => {
    if (currentPage < totalPages) {
        currentPage++;

        if (btn.classList.contains("disabled-btn")) {
            btn.classList.remove("disabled-btn");
        }
    } else {
        btn.classList.add("disabled-btn");
    }

    // Update Table
    setDateInPage();
};

// 4. <-- Toggle Reserve Appointment Pop up -->

document.getElementById("reserve-popup-btn").addEventListener("click", () => {
    reservePopup.classList.replace("hidden", "flex");

    // Disable the Search Input
    searchInp.disabled = true;
});

document.getElementById("cancel-btn").addEventListener("click", () => {
    reservePopup.classList.replace("flex", "hidden");

    // Enable the Search Input
    searchInp.disabled = false;
});

// 5. <-- Get Data -->

document.getElementById("reserve-btn").addEventListener("click", () => {
    let currentFirstName = firstNameInp.value,
        currentLastName = lastNameInp.value,
        currentPhoneNumber = phoneNumberInp.value,
        currentEmail = emailInp.value,
        currentReason = reasonInp.value,
        currentDate = dateInp.value;

    // Remove Empty Error Class
    inputs.forEach((input) => input.classList.remove("empty-error"));

    // Check If All the Required Data was Given
    if (
        currentFirstName != "" &&
        currentLastName != "" &&
        currentPhoneNumber != "" &&
        currentEmail != "" &&
        currentReason != "" &&
        currentDate != ""
    ) {
        // Get Data
        appointmentsData.push({
            id: appointments.length + 1,
            firstName: currentFirstName,
            lastName: currentLastName,
            phoneNumber: currentPhoneNumber,
            email: currentEmail,
            reason: currentReason,
            date: currentDate,
        });

        // Hide the Pop up
        reservePopup.classList.replace("flex", "hidden");

        // Show Success Pop up
        showPopup("success", "The appointment has been added successfully!");

        // Reset the Inputs
        firstNameInp.value = "";
        lastNameInp.value = "";
        phoneNumberInp.value = "";
        emailInp.value = "";
        reasonInp.value = "";
        dateInp.value = "";

        // Update the Table in the Page
        setDateInPage();

        // Set Date in the Localstorage
        updateLocalstorage();

        // Enable the Search Input
        searchInp.disabled = false;
    } else {
        showPopup("error", "Some of the required data was not given!");

        // Add Empty Error Class
        inputs.forEach((input) => {
            if (input.value == "") {
                input.classList.add("empty-error");
            }
        });
    }
});

// 6. <-- Set Data in the Page -->

setDateInPage();

// 7. <-- Delete an Item -->

// Delete an Item
document.getElementById("delete-btn").addEventListener("click", () => {
    deleteItem();
});

// 8. <-- Handle Seacrh -->

searchInp.addEventListener("input", () => {
    let searchValue = searchInp.value.toLowerCase();

    if (searchValue !== "") {
        // Show Close Search Button
        closeSearch.classList.replace("hidden", "flex");

        // Reset the Main Data
        appointmentsData =
            JSON.parse(localStorage.getItem("appointments")) || [];

        // Filter tha Data Based on the Search
        let filtredData = [];
        for (let appointment of appointmentsData) {
            let check =
                appointment.firstName.toLowerCase().includes(searchValue) ||
                appointment.lastName.toLowerCase().includes(searchValue) ||
                appointment.phoneNumber.toLowerCase().includes(searchValue) ||
                appointment.email.toLowerCase().includes(searchValue);

            if (check) {
                filtredData.push(appointment);
            }

            // Set the Filtered Data in the Main Array
            appointmentsData = filtredData;

            // Update the Table
            setDateInPage();
        }
    } else {
        // Hide Close Search Button
        closeSearch.classList.replace("flex", "hidden");

        // Reset the Main Data
        appointmentsData =
            JSON.parse(localStorage.getItem("appointments")) || [];

        // Update the Table
        setDateInPage();
    }
});

closeSearch.addEventListener("click", () => {
    // Empty the Input
    searchInp.value = "";

    // Hide Close Search Button
    closeSearch.classList.replace("flex", "hidden");

    // Reset the Main Data
    appointmentsData = JSON.parse(localStorage.getItem("appointments")) || [];

    // Update the Table
    setDateInPage();
});

// 9. <-- Handle App Theme Modes -->

document.getElementById("theme-btn").addEventListener("click", () => {
    let rootElement = document.documentElement;

    if (theme == "light") {
        // Toggle CSS Variables
        rootElement.style.setProperty("--main-bg", "#000");
        rootElement.style.setProperty("--secondary-bg", "#000");
        rootElement.style.setProperty("--text-color", "#fff");

        // Switch Theme
        theme = "dark";
    } else {
        // Toggle CSS Variables
        rootElement.style.setProperty("--main-bg", "#eee");
        rootElement.style.setProperty("--secondary-bg", "#fff");
        rootElement.style.setProperty("--text-color", "#000");

        // Switch Theme
        theme = "light";
    }
});
