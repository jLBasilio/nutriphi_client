import * as constants from '../constants';

export const capitalize = async name => name[0].toUpperCase() + name.slice(1);

export const convertKgToLBS = async kg => parseFloat((kg * 2.2).toFixed(2));

export const getBMIFromGoal = async ({ goalKg, heightCm }) => {
  const bmi = parseFloat((goalKg / ((heightCm / 100) ** 2)).toFixed(2));
  switch (true) {
    case (bmi >= 30):
      return 'obese';
    case (bmi >= 25):
      return 'overweight';
    case (bmi <= 18.5):
      return 'underweight';
    default:
      return 'normal';
  }
};

export const getTEA = async (weightKg, lifestyleMultiplier) => (
  parseFloat((weightKg * lifestyleMultiplier).toFixed(2))
);

export const getNutriDist = async (goalTEA) => {
  const toReturn = {
    choPerDay: parseFloat(((goalTEA * constants.CHO_MUL) / constants.KCAL_PER_CHO_MUL).toFixed(2)),
    proPerDay: parseFloat(((goalTEA * constants.PRO_MUL) / constants.KCAL_PER_PRO_MUL).toFixed(2)),
    fatPerDay: parseFloat(((goalTEA * constants.FAT_MUL) / constants.KCAL_PER_FAT_MUL).toFixed(2))
  };
  return toReturn;
};

export const validateTimeSpan = async (poundDiff, weeks) => {
  const kcalNeeded = parseFloat(((poundDiff * constants.KCAL_PER_POUND) / weeks).toFixed(2));
  return kcalNeeded <= 1100 ? kcalNeeded : null;
};

export const getDiffWeeks = async (toDateString) => {
  let diff = (new Date(toDateString) - new Date(Date.now()).getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.round(diff);
};

export const getDBW = async ({ sex, heightCm }) => {
  const toReturn = {};
  switch (Math.round(heightCm)) {
    case 129:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '29.5-36';
      break;

    case 130:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '30.1-36.8';
      break;

    case 131:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '30.7-37.5';
      break;

    case 132:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '31.3-38.2';
      break;

    case 133:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '31.9-38.9';
      break;

    case 134:
      toReturn.dbwKg = sex === 'M' ? '30.1-36.8' : '32.5-39.7';
      break;

    case 135:
      toReturn.dbwKg = sex === 'M' ? '30.8-37.7' : '33.1-40.4';
      break;

    case 136:
      toReturn.dbwKg = sex === 'M' ? '31.5-38.5' : '33.6-41.4';
      break;

    case 137:
      toReturn.dbwKg = sex === 'M' ? '32.2-39.4' : '34.2-41.8';
      break;

    case 138:
      toReturn.dbwKg = sex === 'M' ? '32.9-40.3' : '34.8-42.6';
      break;

    case 139:
      toReturn.dbwKg = sex === 'M' ? '33.6-41.1' : '35.4-43.3';
      break;

    case 140:
      toReturn.dbwKg = sex === 'M' ? '34.4-42' : '36-44';
      break;

    case 141:
      toReturn.dbwKg = sex === 'M' ? '35.1-42.8' : '36.6-44.8';
      break;

    case 142:
      toReturn.dbwKg = sex === 'M' ? '35.8-43.7' : '37.2-45.5';
      break;

    case 143:
      toReturn.dbwKg = sex === 'M' ? '36.5-44.6' : '37.8-46.2';
      break;

    case 144:
      toReturn.dbwKg = sex === 'M' ? '37.2-45.4' : '38.4-47.3';
      break;

    case 145:
      toReturn.dbwKg = sex === 'M' ? '37.9-46.3' : '39-47.6';
      break;

    case 146:
      toReturn.dbwKg = sex === 'M' ? '38.6-47.2' : '39.6-48.4';
      break;

    case 147:
      toReturn.dbwKg = sex === 'M' ? '39.3-48' : '40.2-49.1';
      break;

    case 148:
      toReturn.dbwKg = sex === 'M' ? '40-48.9' : '40.8-49.8';
      break;

    case 149:
      toReturn.dbwKg = sex === 'M' ? '40.7-49.7' : '41.4-50.5';
      break;

    case 150:
      toReturn.dbwKg = sex === 'M' ? '41.4-50.6' : '41.9-51.3';
      break;

    case 151:
      toReturn.dbwKg = sex === 'M' ? '42.1-51.5' : '42.6-52';
      break;

    case 152:
      toReturn.dbwKg = sex === 'M' ? '42.8-52.3' : '43.1-52.7';
      break;

    case 153:
      toReturn.dbwKg = sex === 'M' ? '43.5-53.2' : '43.7-53.4';
      break;

    case 154:
      toReturn.dbwKg = sex === 'M' ? '44.2-54' : '44.3-54.1';
      break;

    case 155:
      toReturn.dbwKg = sex === 'M' ? '44.9-54.9' : '44.9-54.9';
      break;

    case 156:
      toReturn.dbwKg = sex === 'M' ? '45.6-55.8' : '45.5-55.6';
      break;

    case 157:
      toReturn.dbwKg = sex === 'M' ? '46.3-56.3' : '46.1-56.4';
      break;

    case 158:
      toReturn.dbwKg = sex === 'M' ? '47.4-57.5' : '46.7-57.1';
      break;

    case 159:
      toReturn.dbwKg = sex === 'M' ? '47.8-58.4' : '47.3-57.8';
      break;

    case 160:
      toReturn.dbwKg = sex === 'M' ? '48.4-59.2' : '47.9-58.5';
      break;

    case 161:
      toReturn.dbwKg = sex === 'M' ? '49.1-60.1' : '48.5-59.3';
      break;

    case 162:
      toReturn.dbwKg = sex === 'M' ? '49.9-60.9' : '49.1-60';
      break;

    case 163:
      toReturn.dbwKg = sex === 'M' ? '50.6-61.8' : '49.7-60.7';
      break;

    case 164:
      toReturn.dbwKg = sex === 'M' ? '51.3-62.7' : '50.3-61.4';
      break;

    case 165:
      toReturn.dbwKg = sex === 'M' ? '52-63.5' : '50.8-62.2';
      break;

    case 166:
      toReturn.dbwKg = sex === 'M' ? '52.7-64.4' : '51.4-62.9';
      break;

    case 167:
      toReturn.dbwKg = sex === 'M' ? '53.4-65.2' : '52-63.6';
      break;

    case 168:
      toReturn.dbwKg = sex === 'M' ? '54.1-66.1' : '52.6-64.3';
      break;

    case 169:
      toReturn.dbwKg = sex === 'M' ? '54.8-67' : '53.8-65.8';
      break;

    case 170:
      toReturn.dbwKg = sex === 'M' ? '55.5-67.8' : '53.8-65.8';
      break;

    case 171:
      toReturn.dbwKg = sex === 'M' ? '56.2-68.7' : '53.8-65.8';
      break;

    case 172:
      toReturn.dbwKg = sex === 'M' ? '56.9-69.6' : '53.8-65.8';
      break;

    case 173:
      toReturn.dbwKg = sex === 'M' ? '57.6-70.4' : '53.8-65.8';
      break;

    case 174:
      toReturn.dbwKg = sex === 'M' ? '58.3-71.3' : '53.8-65.8';
      break;

    case 175:
      toReturn.dbwKg = sex === 'M' ? '59-72.1' : '53.8-65.8';
      break;

    case 176:
      toReturn.dbwKg = sex === 'M' ? '59.7-73' : '53.8-65.8';
      break;

    case 177:
      toReturn.dbwKg = sex === 'M' ? '60.4-73.9' : '53.8-65.8';
      break;

    case 178:
      toReturn.dbwKg = sex === 'M' ? '61.1-74.7' : '53.8-65.8';
      break;

    case 179:
      toReturn.dbwKg = sex === 'M' ? '61.8-75.6' : '53.8-65.8';
      break;

    case 180:
      toReturn.dbwKg = sex === 'M' ? '62.6-76.4' : '53.8-65.8';
      break;

    case 181:
      toReturn.dbwKg = sex === 'M' ? '63.2-77.3' : '53.8-65.8';
      break;

    case 182:
      toReturn.dbwKg = sex === 'M' ? '64-78.2' : '53.8-65.8';
      break;

    default:
      break;
  }
  const [lowerBound, upperBound] = toReturn.dbwKg.split('-');
  toReturn.dbwLbs = `${await convertKgToLBS(lowerBound)}-${await convertKgToLBS(upperBound)}`;
  return toReturn;
};
