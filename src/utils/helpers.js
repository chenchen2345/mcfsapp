function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}

function calculateAge(birthDate) {
  const ageDiff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(ageDiff / (1000 * 3600 * 24 * 365.25));
}

function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

export { formatDate, calculateAge, generateRandomId };