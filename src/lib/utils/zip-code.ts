// NOTE: zipcodes library only supports US and Canada zipcodes in realtime
import zipcodes from 'zipcodes';
export const isValidZipCode = (zipCode: string): boolean => {
  const zipValue = zipcodes.lookup(zipCode);
  return zipValue ? true : false;
};
