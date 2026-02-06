// Google Apps Script to serve data from two tabs in a Google Sheet

function doGet() {
  try {
    // Automatically get the active Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    // Replace with the names of your tabs
    const tabNames = ["dorms", "events"];

    const data = {};

    tabNames.forEach((tabName) => {
      const sheetTab = sheet.getSheetByName(tabName);
      if (sheetTab) {
        const rows = sheetTab.getDataRange().getValues();
        console.log(`Data from ${tabName}:`, rows); // Log the raw data
        if (rows.length > 1) {
          // Ensure there is data beyond the header row
          const headers = rows.shift(); // Extract header row
          data[tabName] = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
        } else {
          console.log(`No data found in ${tabName} beyond the header row.`);
        }
      } else {
        console.log(`Tab ${tabName} does not exist.`);
      }
    });

    const jsonOutput = ContentService.createTextOutput(JSON.stringify(data));
    jsonOutput.setMimeType(ContentService.MimeType.JSON);
    return jsonOutput;
  } catch (error) {
    // Log the error for debugging
    console.error("Error: ", error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
