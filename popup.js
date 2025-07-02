//Runs when user clicks "Fill Attendance"
document.getElementById("fill-attendance").addEventListener("click", async () => {

    // Get attendance file from popup
    const file = document.getElementById("attendance-sheet").files[0];

    if (!file) {
        alert("Please select a CSV file first.");
        return;
    }

    const text = await file.text();
    const rows = text.trim().split("\n").map(row => row.split(",")); //gets the rows of the attendance csv file

    // Check that user's attendance file follows the correct format
    let containsRegisteredParticipantColumn = false
    for (let i = 0; i < rows[0].length; i++) {
        if (rows[0][i] == "Registered participant"){
            containsRegisteredParticipantColumn = true;
        }
    }
    if (containsRegisteredParticipantColumn == false) {
        alert("CSV file must contain a 'Registered participant' column");
        return;
    }

    // Get the frameId of the roll call iframe and send data to content.js
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0];
        const tabId = tab.id;

        chrome.webNavigation.getAllFrames({tabId}, (frames) => {
            const rollCallFrame = frames.find(frame => 
                frame.url.includes("rollcall.instructure.com/sections")
            );

            if (rollCallFrame) {
                chrome.tabs.sendMessage(
                    tabId,
                    {
                        type: "attendance-sheet",
                        data: rows
                    },
                    {frameId: rollCallFrame.frameId}
                );
            } else {
                alert("Failed to identify Roll Call iframe");
            }
        });
    });
    
});