export const getBMIClass = async (bmi) => {
  switch (true) {
    case (bmi >= 30):
      return 'Obese';
    case (bmi >= 25):
      return 'Overweight';
    case (bmi <= 18.5):
      return 'Underweight';
    default:
      return 'Normal';
  }
};
