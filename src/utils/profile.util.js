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

export const calculateDaysLeft = async (dateSet) => {
  const timeDiff = new Date(dateSet).getTime() - new Date().getTime();
  const dayDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
  const weeksLeft = Math.floor(dayDifference / 7);
  const daysLeft = dayDifference % 7;
  return { weeksLeft, daysLeft };
};
