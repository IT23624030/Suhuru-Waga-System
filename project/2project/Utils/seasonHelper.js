function getSeason(date) {
  const month = date.getMonth() + 1; // Jan = 1
  if (month >= 9 || month <= 2) return "Maha"; // Sept-Feb
  return "Yala"; // Mar-Aug
}

function seasonalWeight(resourceType, season) {
  if (season === "Maha") {
    if (["tractor", "seed"].includes(resourceType)) return 1.2;
    if (resourceType === "irrigation") return 1.15;
  }
  if (season === "Yala") {
    if (["fertilizer", "irrigation"].includes(resourceType)) return 1.15;
  }
  return 1.0; // default
}

module.exports = { getSeason, seasonalWeight };
