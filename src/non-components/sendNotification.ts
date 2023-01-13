export async function sendNotification(body: string) {
  const result = await Notification.requestPermission();

  const title = "Pixel.ai";
  const options: NotificationOptions = {
    body,
    icon: `/logo.png`,
    badge: `/badge.png`,
  };

  if (result === "granted") {
    try {
      new Notification(title, options);
    } catch (e) {
      const serviceWorker = await navigator.serviceWorker.ready;
      serviceWorker.showNotification(title, options);
    }
  }
}
