export function setLocalStorageItem(key: string, value: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  } else {
    // Handle the case where localStorage is not available (e.g., in a non-browser environment)
    console.error('Cannot set localStorage item: localStorage is not defined.');
  }
}

export function getLocalStorageItem(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  } else {
    // Handle the case where localStorage is not available (e.g., in a non-browser environment)
    console.error('Cannot get localStorage item: localStorage is not defined.');
    return null;
  }
}

export function generateRandomName() {
  // Function to generate a random uppercase letter
  function getRandomLetter() {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet.charAt(randomIndex);
  }

  // Function to generate a random 4-digit number
  function getRandomDigits() {
      return Math.floor(1000 + Math.random() * 9000);
  }

  // Combine a random letter and random digits to create the name
  const randomLetter = getRandomLetter();
  const randomDigits = getRandomDigits();
  const randomName = `${randomLetter}${randomDigits}`;

  return randomName;
}

