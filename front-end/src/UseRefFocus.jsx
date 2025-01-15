// Business Domain: User Interface Enhancement
// Feature: Auto-Focus Input Field on Component Mount

import React, { useRef, useEffect } from "react";

const AutoFocusInput = () => {
  // Menggunakan useRef untuk menyimpan referensi ke elemen input
  const inputRef = useRef(null);

  useEffect(() => {
    // Setelah komponen dipasang, fokuskan elemen input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Dependency array kosong memastikan efek ini hanya berjalan sekali saat mount

  return (
    <div>
      <label htmlFor="name">Name:</label>
      {/* Menghubungkan ref ke elemen input */}
      <input
        type="text"
        id="name"
        ref={inputRef}
        placeholder="Enter your name"
      />
    </div>
  );
};

export default AutoFocusInput;
