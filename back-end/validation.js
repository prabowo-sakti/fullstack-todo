export const validateUsername = (username) => {
  // Check if username is empty
  if (!username || username.trim() === "") {
    return {
      isValid: false,
      message: "Username tidak boleh kosong",
    };
  }
  if (/\s/.test(username)) {
    return {
      isValid: false,
      message: "Username tidak boleh mengandung spasi",
    };
  }

  // Check if username contains forbidden characters left to right: u200e
  const forbiddenCharacters =
    /[\u0000-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3000\u2800\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/;
  if (forbiddenCharacters.test(username)) {
    return {
      isValid: false,
      message: "Username tidak boleh mengandung karakter khusus",
    };
  }
  const usernameRegexValidation = /^[a-zA-Z0-9_.-]+$/;
  if (!usernameRegexValidation.test(username)) {
    return {
      isValid: true,
      message:
        "Username hanya boleh mengandung huruf(a-z), angka(0-9), garis bawah (_), titik (.), dan tanda hubung (-)",
    };
  }
  return { isValid: true };
};
