import * as constants from '../constants';

export const getNutriDist = async ({ dbwKg, lifestyleMultiplier }) => {
  const tea = dbwKg * lifestyleMultiplier;
  const toReturn = {
    choPerDay: ((tea * constants.CHO_MUL) / constants.CHO_PER_KCAL).toFixed(2),
    proPerDay: ((tea * constants.PRO_MUL) / constants.PRO_PER_KCAL).toFixed(2),
    fatPerDay: ((tea * constants.FAT_MUL) / constants.FAT_PER_KCAL).toFixed(2)
  };
  return toReturn;
};

export const convertKgToLBS = async kg => Math.round(kg * 2.2);

export const getDBW = async ({ sex, heightCm }) => {
  const toReturn = {};
  switch (Math.round(heightCm)) {
    case 129:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 130:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 131:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 132:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 133:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 134:
      toReturn.dbwKg = sex === 'M' ? 34 : 33;
      break;

    case 135:
      toReturn.dbwKg = sex === 'M' ? 35 : 37;
      break;

    case 136:
      toReturn.dbwKg = sex === 'M' ? 35 : 38;
      break;

    case 137:
      toReturn.dbwKg = sex === 'M' ? 36 : 38;
      break;

    case 138:
      toReturn.dbwKg = sex === 'M' ? 37 : 39;
      break;

    case 139:
      toReturn.dbwKg = sex === 'M' ? 38 : 40;
      break;

    case 140:
      toReturn.dbwKg = sex === 'M' ? 39 : 40;
      break;

    case 141:
      toReturn.dbwKg = sex === 'M' ? 39 : 41;
      break;

    case 142:
      toReturn.dbwKg = sex === 'M' ? 40 : 42;
      break;

    case 143:
      toReturn.dbwKg = sex === 'M' ? 41 : 42;
      break;

    case 144:
      toReturn.dbwKg = sex === 'M' ? 42 : 43;
      break;

    case 145:
      toReturn.dbwKg = sex === 'M' ? 43 : 44;
      break;

    case 146:
      toReturn.dbwKg = sex === 'M' ? 43 : 44;
      break;

    case 147:
      toReturn.dbwKg = sex === 'M' ? 44 : 45;
      break;

    case 148:
      toReturn.dbwKg = sex === 'M' ? 45 : 46;
      break;

    case 149:
      toReturn.dbwKg = sex === 'M' ? 46 : 46;
      break;

    case 150:
      toReturn.dbwKg = sex === 'M' ? 46 : 47;
      break;

    case 151:
      toReturn.dbwKg = sex === 'M' ? 47 : 48;
      break;

    case 152:
      toReturn.dbwKg = sex === 'M' ? 48 : 48;
      break;

    case 153:
      toReturn.dbwKg = sex === 'M' ? 49 : 49;
      break;

    case 154:
      toReturn.dbwKg = sex === 'M' ? 50 : 50;
      break;

    case 155:
      toReturn.dbwKg = sex === 'M' ? 50 : 50;
      break;

    case 156:
      toReturn.dbwKg = sex === 'M' ? 51 : 51;
      break;

    case 157:
      toReturn.dbwKg = sex === 'M' ? 52 : 52;
      break;

    case 158:
      toReturn.dbwKg = sex === 'M' ? 53 : 52;
      break;

    case 159:
      toReturn.dbwKg = sex === 'M' ? 54 : 53;
      break;

    case 160:
      toReturn.dbwKg = sex === 'M' ? 54 : 54;
      break;

    case 161:
      toReturn.dbwKg = sex === 'M' ? 55 : 54;
      break;

    case 162:
      toReturn.dbwKg = sex === 'M' ? 56 : 55;
      break;

    case 163:
      toReturn.dbwKg = sex === 'M' ? 57 : 56;
      break;

    case 164:
      toReturn.dbwKg = sex === 'M' ? 57 : 56;
      break;

    case 165:
      toReturn.dbwKg = sex === 'M' ? 58 : 57;
      break;

    case 166:
      toReturn.dbwKg = sex === 'M' ? 59 : 58;
      break;

    case 167:
      toReturn.dbwKg = sex === 'M' ? 60 : 58;
      break;

    case 168:
      toReturn.dbwKg = sex === 'M' ? 61 : 59;
      break;

    case 169:
      toReturn.dbwKg = sex === 'M' ? 61 : 60;
      break;

    case 170:
      toReturn.dbwKg = sex === 'M' ? 62 : 60;
      break;

    case 171:
      toReturn.dbwKg = sex === 'M' ? 63 : 60;
      break;

    case 172:
      toReturn.dbwKg = sex === 'M' ? 64 : 60;
      break;

    case 173:
      toReturn.dbwKg = sex === 'M' ? 64 : 60;
      break;

    case 174:
      toReturn.dbwKg = sex === 'M' ? 65 : 60;
      break;

    case 175:
      toReturn.dbwKg = sex === 'M' ? 66 : 60;
      break;

    case 176:
      toReturn.dbwKg = sex === 'M' ? 67 : 60;
      break;

    case 177:
      toReturn.dbwKg = sex === 'M' ? 68 : 60;
      break;

    case 178:
      toReturn.dbwKg = sex === 'M' ? 68 : 60;
      break;

    case 179:
      toReturn.dbwKg = sex === 'M' ? 69 : 60;
      break;

    case 180:
      toReturn.dbwKg = sex === 'M' ? 70 : 60;
      break;

    case 181:
      toReturn.dbwKg = sex === 'M' ? 71 : 60;
      break;

    case 182:
      toReturn.dbwKg = sex === 'M' ? 72 : 60;
      break;

    default:
      break;
  }

  toReturn.dbwLbs = await convertKgToLBS(toReturn.dbwKg);
  return toReturn;
};
