// Service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service_worker.js", { scope: "/" })
    .then(service_worker => {
      console.log(
        "Service Worker Registration Successful: " + service_worker.scope
      );
    })
    .catch(error => {
      console.log("Service Worker Registration Failed: " + error);
    });
}
