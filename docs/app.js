// Configure Dropzone
Dropzone.autoDiscover = false;

$(document).ready(function () {
    // The results area is hidden by default in the HTML
    // Initialize Dropzone
    let dz = new Dropzone("#dropzone", {
        url: "http://127.0.0.1:8000/api/detect_from_upload",
        maxFiles: 1,
        addRemoveLinks: true,
        autoProcessQueue: false, // We will trigger processing manually
        acceptedFiles: "image/*",
        
        init: function() {
            // Ensure only one file is in the dropzone at a time
            this.on("addedfile", function(file) {
                if (this.files.length > 1) {
                    this.removeFile(this.files[0]);
                }
            });

            // Handle the server's response
            this.on("success", function (file, response) {
                console.log("Server response:", response);
                $("#uploader-area").hide();
                $("#results-area").show();
                this.removeFile(file); // Clear the preview

                if (response.error) {
                    $("#error").show().text("Error: " + response.error);
                    $("#resultHolder").hide();
                    $("#divClassTable").hide();
                } else {
                    $("#error").hide();

                    // Display the uploaded image
                    $("#resultHolder").html(`<img src="${file.dataURL}" class="img-fluid uploaded-image" />`);
                    
                    // Populate the results table with classification data
                    let predictions = response.predictions;
                    let bestMatch = response.best_match;

                    let tableHtml = "<thead><tr><th>Person</th><th>Match Percentage</th></tr></thead><tbody>";
                    
                    predictions.forEach(function(p) {
                        let isBestMatch = p.name === bestMatch;
                        // Use a class to highlight the best match
                        tableHtml += `<tr ${isBestMatch ? 'class="best-match"' : ''}>
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
                $("#uploader-area").hide();
                $("#error").show().text("Upload Error: Could not connect to the server or an error occurred.");
                $("#results-area").show();
                this.removeFile(file);
            });
        }
    });

    // Handle the "Detect" button click
    $("#submitBtn").on('click', function (e) {
        if (dz.getQueuedFiles().length > 0) {
            dz.processQueue(); // Tell Dropzone to process the file
        } else {
            alert("Please select an image to detect faces in!");
        }
    });

    // Handle the "Detect Another" button click
    $("#detectAnotherBtn").on('click', function() {
        $("#results-area").hide();
        $("#uploader-area").show();
        dz.removeAllFiles();
    });
});