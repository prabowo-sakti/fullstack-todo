export function setupGlobalErrorHandlers() {
  const events = ["uncaughtException", "unhandledRejection", "exit", "SIGNT"];

  events.forEach((event) => {
    process.on(event, (error) => {
      console.log(`This is an ${event} event`);
      if (error) {
        console.log(`Error details:${error.message}`);
        console.log(`Error stack: ${error.stack}`);
      }
    });
  });
  console.log("Global error handlers are set up successfullly");
}
