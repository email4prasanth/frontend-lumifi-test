import i18next from 'i18next';

/**
 * Function to translate a given key within a namespace
 * @param {string} namespace - The translation namespace ('lumifi')
 * @param {string} key - The translation key
 * @param {Object} [values] - Optional dynamic values for interpolation
 * @returns {string} - Translated string
 */

type TNamespace = 'lumifi';

const translate = (namespace: TNamespace, key: string, values = {}) => {
  return i18next.t(key, { ns: namespace, ...values });
};

export { translate as t };
