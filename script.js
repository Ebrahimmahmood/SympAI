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

// Function to check symptoms
function checkSymptoms(input) {
  const words = input.toLowerCase().split(/,|\s+/);
  const results = new Set();
  words.forEach(word => {
    word = word.trim();
    if (symptomMap[word]) {
      symptomMap[word].forEach(condition => results.add(condition));
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
