function sendMeetingReminder() {
    const today = stripTime(new Date());

    // Get find meeting it its within the next 10 days
    const meeting = getUpcomingEvents(10).find(event =>
        event.getStartTime().toDateString() !== today.toDateString() &&
        event.getTitle() === "Monthly Business Meeting"
    );

    if (!meeting) {
        Logger.log("No upcoming meeting found.");
        return;
    }

    const meetingDate = stripTime(meeting.getStartTime());
    const daysUntilMeeting = (meetingDate - today) / (1000 * 60 * 60 * 24);

    const emailBody = meetingReminderEmails[daysUntilMeeting];
    if (!emailBody) {
        Logger.log(`No reminder scheduled. Meeting is in ${daysUntilMeeting} days.`);
        return;
    }

    const bccEmails = getEmailsFromSheet();
    // Send the email if there are recipients
    if (bccEmails.length) {
        const myEmail = Session.getActiveUser().getEmail();
        GmailApp.sendEmail(bccEmails[0], "Service Report Reminder", '', {
            htmlBody: emailBody,
        });
        // bcc: bccEmails.join(","),
        Logger.log(`Reminder sent for meeting on ${meetingDate}`);
    }
}

function getUpcomingEvents(daysAhead) {
    const calendar = CalendarApp.getDefaultCalendar();
    const today = stripTime(new Date());
    const endDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return calendar.getEvents(today, endDate);
}

function getEmailsFromSheet() {
    return ["a.threadless@proton.me"];
    // const sheetId = "1xtQXunPmSA9dFP_ydbXBYibSSI4zHD052N-nGcgb4c8";
    // const sheetName = "Contacts";
    // const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

    // // Get all emails from column A starting from the second row
    // return sheet.getRange("A2:A").getValues()
    //     .flat()
    //     .filter(email => email.includes("@"));
}

function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Email templates for different reminder days
const meetingReminderEmails = {
    7: `
        <p>Hi Folks,</p>
        <p>It's that time again!</p>
        <p>Please reply to this message with your service reports and committee updates by this coming Friday so we can include them in the business meeting agenda.</p>
        <p>Thank you all for your hard work this month!</p>
        <p>- GMQTs Secretaries</p>
    `,
    3: `
        <p>Hi Everyone,</p>
        <p>Just a quick reminder—if you haven't already sent in your monthly service reports and committee updates, please take a moment to do so by this Friday.</p>
        <p>We're finalizing the agenda for the upcoming business meeting and would love to include everyone's updates!</p>
        <p>Thanks so much for all you do!</p>
        <p>- GMQTs Secretaries</p>
    `,
    1:  `
        <p>Hi Team,</p>
        <p>This is your final reminder to send in your monthly service reports and committee updates by the end of today if you haven't already.</p>
        <p>We're wrapping up the agenda for tomorrow's business meeting and want to make sure your contributions are included.</p>
        <p>Appreciate all the time and energy you put in each month! See you tomorrow!</p>
        <p>- GMQTs Secretaries</p>
    `
};
