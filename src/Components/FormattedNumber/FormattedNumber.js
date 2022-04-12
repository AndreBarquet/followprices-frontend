import React from 'react';
import PropTypes from 'prop-types';
import CurrencyFormat from 'react-currency-format';
import { isNotNumber, isNotString, notExists } from '../../utils/utils';
/**
 * Display a formatted number, using or not: prefix, suffix, value colors, etc.
 */
function FormattedNumber(props) {
  const { value, prefix, suffix, removeScale = false, precisionScale = 2, useBRformat = true } = props;
  if (notExists(value) || (isNotNumber(value) && isNotString(value)) || isNaN(value)) return "-";

  const decimalOption = removeScale ? {} : { decimalScale: precisionScale, fixedDecimalScale: true };

  return (
    <CurrencyFormat
      value={value}
      displayType="text"
      thousandSeparator={useBRformat ? "." : ","}
      decimalSeparator={useBRformat ? "," : "."}
      prefix={prefix ?? ""}
      suffix={suffix ?? ""}
      isNumericString={false}
      {...decimalOption}
    />
  );
}

FormattedNumber.propTypes = {
  /**
   * @description The target value to be formatted.
   */
  value: PropTypes.string || PropTypes.number,
  /**
   * @description Prefix of the value, not show by default
   */
  prefix: PropTypes.string,
  /**
   * @description Suffix of the value, not show by default
   */
  suffix: PropTypes.string,
  /**
   * @description Wheter to use or not the positive/negative colors
   * @default false
   */
  useColors: PropTypes.bool,
  /**
    * @description Wheter to remove or not the default two decimal scale and show the full number
    * @default false
    */
  removeScale: PropTypes.bool,
  /**
   * @description Number of decimal scales to use
   * @default 2   
   */
  precisionScale: PropTypes.number,
  /**
   * @description Wheter to use or not the brazilian number format
   * @default true  
   */
  useBRformat: PropTypes.bool,
};

export default FormattedNumber;