// Configure Dropzone
Dropzone.autoDiscover = false;

// Dark Mode Toggle Function
function toggleDarkMode() {
	const body = document.body;
	const darkModeToggle = document.querySelector(".dark-mode-toggle");
	const darkModeIcon = document.querySelector(".dark-mode-icon");
	const darkModeText = document.querySelector(".dark-mode-text");

	body.classList.toggle("dark-mode");

	// Update button text and icon
	if (body.classList.contains("dark-mode")) {
		darkModeIcon.textContent = "☀️";
		darkModeText.textContent = "Light";
		localStorage.setItem("darkMode", "enabled");
	} else {
		darkModeIcon.textContent = "🌙";
		darkModeText.textContent = "Dark";
		localStorage.setItem("darkMode", "disabled");
	}
}

// Load dark mode preference on page load
function loadDarkModePreference() {
	const darkMode = localStorage.getItem("darkMode");
	const body = document.body;
	const darkModeIcon = document.querySelector(".dark-mode-icon");
	const darkModeText = document.querySelector(".dark-mode-text");

	if (darkMode === "enabled") {
		body.classList.add("dark-mode");
		if (darkModeIcon && darkModeText) {
			darkModeIcon.textContent = "☀️";
			darkModeText.textContent = "Light";
		}
	}
}

// Load preference when page loads
document.addEventListener("DOMContentLoaded", loadDarkModePreference);

$(document).ready(function () {
	// Navbar scroll effect
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$(".navbar").addClass("scrolled");
		} else {
			$(".navbar").removeClass("scrolled");
		}
	});

	// Smooth scrolling for navigation links
	$('.navbar-nav a[href^="#"]').on("click", function (e) {
		e.preventDefault();

		let target = $(this.getAttribute("href"));
		if (target.length) {
			let scrollOffset = target.attr("id") === "celebrities" ? -80 : -70;
			$("html, body")
				.stop()
				.animate(
					{
						scrollTop: target.offset().top + scrollOffset,
					},
					300 // Faster animation (300ms instead of 1000ms)
				);

			// Update active nav link
			$(".navbar-nav .nav-link").removeClass("active");
			$(this).addClass("active");

			// Close mobile menu if open
			$(".navbar-collapse").collapse("hide");
		}
	});

	// Handle home navigation separately since we removed the home div
	$('.navbar-nav a[href="#home"]').on("click", function (e) {
		e.preventDefault();

		$("html, body").stop().animate(
			{
				scrollTop: 0,
			},
			300
		);

		// Update active nav link
		$(".navbar-nav .nav-link").removeClass("active");
		$(this).addClass("active");

		// Close mobile menu if open
		$(".navbar-collapse").collapse("hide");
	});

	// The results area is hidden by default in the HTML
	// Initialize Dropzone
	let dz = new Dropzone("#dropzone", {
		url: "http://127.0.0.1:8000/api/detect_from_upload", // Backend server URL
		maxFiles: 1,
		addRemoveLinks: true,
		autoProcessQueue: false, // We will trigger processing manually
		acceptedFiles: "image/*",

		init: function () {
			// Ensure only one file is in the dropzone at a time
			this.on("addedfile", function (file) {
				if (this.files.length > 1) {
					this.removeFile(this.files[0]);
				}
			});

			// Handle the server's response
			this.on("success", function (file, response) {
				console.log("Server response:", response);
				$("#uploader-area").fadeOut(200, function() {
					$("#results-area").fadeIn(400);
				});
				this.removeFile(file); // Clear the preview

				if (response.error) {
					$("#error")
						.show()
						.text("Error: " + response.error);
					$("#resultHolder").hide();
					$("#divClassTable").hide();
				} else {
					$("#error").hide();

					// Display the uploaded image
					$("#resultHolder").html(
						`<img src="${file.dataURL}" class="img-fluid uploaded-image" />`
					);

					// Populate the results table with classification data
					let predictions = response.predictions;
					let bestMatch = response.best_match;

					let tableHtml =
						"<thead><tr><th>Person</th><th>Match Percentage</th></tr></thead><tbody>";

					predictions.forEach(function (p) {
						let isBestMatch = p.name === bestMatch;
						// Use a class to highlight the best match
						tableHtml += `<tr ${
							isBestMatch ? 'class="best-match"' : ""
						}>
                                        <td>${p.name}</td>
                                        <td>${p.score}</td>
                                      </tr>`;
					});
					tableHtml += "</tbody>";

					$("#classTable").html(tableHtml);

					// Show the containers for the image and table
					$("#resultHolder").show();
					$("#divClassTable").show();
				}
			});

			// Handle upload errors
			this.on("error", function (file, message) {
				console.error("Upload error:", message);
				$("#uploader-area").fadeOut(200, function () {
					$("#error")
						.show()
						.text(
							"Upload Error: Could not connect to the server or an error occurred."
						);
					$("#results-area").fadeIn(400);
				});
				this.removeFile(file);
			});
		},
	});

	// Handle the "Detect" button click
	$("#submitBtn").on("click", function (e) {
		if (dz.getQueuedFiles().length > 0) {
			dz.processQueue(); // Tell Dropzone to process the file
		} else {
			alert("Please select an image to detect faces in!");
		}
	});

	// Handle the "Detect Another" button click
	$("#detectAnotherBtn").on("click", function () {
		$("#results-area").fadeOut(200, function() {
			$("#uploader-area").fadeIn(400);
		});
		dz.removeAllFiles();
	});
});
