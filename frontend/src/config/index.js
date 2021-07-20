import 'dotenv/config';

export * from './abis';

export const addresses = {
  luna: process.env.REACT_APP_LUNA,
  collectibles: process.env.REACT_APP_COLLECTIBLES,
  lunary: process.env.REACT_APP_LUNARY,
};
