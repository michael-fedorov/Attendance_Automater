//Runs when "Fill Attendance" is clicked
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if (message.type === "attendance-sheet") {
        const csvRows = message.data;
        
        // Get the column number of the names on the attendance sheet
        let namesColumn
        for (i = 0; i < csvRows[0].length; i++) {
            if (csvRows[0][i] == "Registered participant") {
                namesColumn = i;
            }
        }
        
        // Get every name in one list
        let attendingNames = []
        for (i = 1; i < csvRows.length; i ++) {
            attendingNames.push(csvRows[i][namesColumn]);
        }
        
        // Select student list and iterate through every student
        const studentListItem = document.querySelector("#student-list");
        const studentList = studentListItem.getElementsByTagName("li");
        for (let i = 0; i < studentList.length; i++) {
            //set student as the HTML element
            student = studentList[i];

            // Get student name and flatten
            let studentName = "";
            const studentNameRaw = student.querySelector("a.student-toggle > div.student-name");
            if (studentNameRaw) {
                studentName = studentNameRaw.textContent.trim().replace(/\s+/g, " ");
            }

            // Get current attendance status of student
            let studentStatus = "";
            const studentStatusRaw = student.querySelector("a.student-toggle > div.replace-text.student-status");
            if (studentStatusRaw) {
                studentStatus = studentStatusRaw.textContent.trim();
            }
            
            // Change attendance status of student accordingly
            studentButton = student.querySelector("a.student-toggle")
            if (attendingNames.includes(studentName)) {
                if (studentStatus == "unmarked") {
                    studentButton.click();
                }
                else if (studentStatus == "absent") {
                    studentButton.click();
                    studentButton.click();
                }
            }
            else {
                if (studentStatus == "unmarked") {
                    studentButton.click();
                    studentButton.click();
                }
                else if (studentStatus == "present") {
                    studentButton.click();
                }
            }
        }
    }
});