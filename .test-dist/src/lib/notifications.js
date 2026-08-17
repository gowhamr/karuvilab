export async function sendNotification(title, options) {
    if (!("Notification" in window)) {
        return;
    }
    if (Notification.permission === "granted") {
        new Notification(title, options);
    }
    else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            new Notification(title, options);
        }
    }
}
