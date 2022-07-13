self.addEventListener("install", (event) => {
    console.log("Worker installed");
});
  
self.addEventListener("activate", (event) => {
    console.log("Worker activated");
});
  