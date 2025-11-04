const symptomInput = document.getElementById("symptomInput");
const checkBtn = document.getElementById("checkBtn");
const resultsDiv = document.getElementById("results");

// Rule-based symptom → possible conditions
const symptomMap = {
  "fever": ["Flu", "Common Cold", "COVID-19"],
  "cough": ["Common Cold", "Flu", "Bronchitis"],
  "headache": ["Migraine", "Dehydration", "Stress"],
  "sore throat": ["Strep Throat", "Common Cold", "Flu"],
  "fatigue": ["Anemia", "Flu", "Stress"],
  "nausea": ["Food Poisoning", "Stomach Virus", "Pregnancy"],
  "rash": ["Allergy", "Measles", "Chickenpox"]
};

// Synonyms mapping
const synonymMap = {
  "tummy ache": "nausea",
  "head pain": "headache",
  "throat pain": "sore throat"
};

// -------------------
// Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => []);
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = 1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[b.length][a.length];
}

// Find closest symptom (for typos)
function getClosestSymptom(word) {
  word = word.toLowerCase().trim();
  word = synonymMap[word] || word; // apply synonym mapping first
  let closest = null;
  let minDistance = Infinity;

  for (let symptom in symptomMap) {
    const dist = levenshteinDistance(word, symptom);
    if (dist < minDistance && dist <= 2) { // allow up to 2 character differences
      minDistance = dist;
      closest = symptom;
    }
  }

  return closest;
}

// Check symptoms input
function checkSymptoms(input) {
  const words = input.toLowerCase().split(/,|\s+/);
  const results = new Set();

  words.forEach(word => {
    word = word.trim();
    if (!word) return;

    const symptom = getClosestSymptom(word);
    if (symptom) {
      symptomMap[symptom].forEach(condition => results.add(condition));
    }
  });

  return Array.from(results);
}

// Event listener
checkBtn.addEventListener("click", () => {
  const input = symptomInput.value;
  if (!input) {
    resultsDiv.innerHTML = "<p>Please enter at least one symptom!</p>";
    return;
  }

  const conditions = checkSymptoms(input);
  if (conditions.length === 0) {
    resultsDiv.innerHTML = "<p>No matching conditions found. Try other symptoms!</p>";
  } else {
    resultsDiv.innerHTML = `<p>Possible conditions:</p><ul>${conditions.map(c => `<li>${c}</li>`).join("")}</ul>`;
  }
});
