function validationUserInput(userInputData) {
  const { username, email, password } = userInputData;
  const usernameRegexValidation = /^(?!.*\u200E) [a-zA-Z0-9_.-]+$/;

  const errors = [];

  if (usernameRegexValidation.test(username)) {
    console.log("username is empty");
  }
}
