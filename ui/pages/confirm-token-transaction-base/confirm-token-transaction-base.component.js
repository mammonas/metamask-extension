import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { I18nContext } from '../../contexts/i18n';
import ConfirmTransactionBase from '../confirm-transaction-base';
import UserPreferencedCurrencyDisplay from '../../components/app/user-preferenced-currency-display';
import {
  formatCurrency,
  convertTokenToFiat,
  addFiat,
  roundExponential,
} from '../../helpers/utils/confirm-tx.util';
import { getWeiHexFromDecimalValue } from '../../helpers/utils/conversions.util';
import { ETH, PRIMARY } from '../../helpers/constants/common';
import { getIsAutoConfirmTransaction } from '../../selectors';

export default function ConfirmTokenTransactionBase({
  toAddress,
  tokenAddress,
  tokenAmount = '0',
  tokenSymbol,
  fiatTransactionTotal,
  ethTransactionTotal,
  ethTransactionTotalMaxAmount,
  contractExchangeRate,
  conversionRate,
  currentCurrency,
  nativeCurrency,
  onEdit,
}) {
  const t = useContext(I18nContext);

  const hexWeiValue = useMemo(() => {
    if (tokenAmount === '0' || !contractExchangeRate) {
      return '0';
    }

    const decimalEthValue = new BigNumber(tokenAmount)
      .times(
        new BigNumber(contractExchangeRate ? String(contractExchangeRate) : 0),
      )
      .toFixed();

    return getWeiHexFromDecimalValue({
      value: decimalEthValue,
      fromCurrency: ETH,
      fromDenomination: ETH,
    });
  }, [tokenAmount, contractExchangeRate]);

  const secondaryTotalTextOverride = useMemo(() => {
    if (typeof contractExchangeRate === 'undefined') {
      return formatCurrency(fiatTransactionTotal, currentCurrency);
    }

    const fiatTransactionAmount = convertTokenToFiat({
      value: tokenAmount,
      toCurrency: currentCurrency,
      conversionRate,
      contractExchangeRate,
    });
    const fiatTotal = addFiat(fiatTransactionAmount, fiatTransactionTotal);
    const roundedFiatTotal = roundExponential(fiatTotal);
    return formatCurrency(roundedFiatTotal, currentCurrency);
  }, [
    currentCurrency,
    conversionRate,
    contractExchangeRate,
    fiatTransactionTotal,
    tokenAmount,
  ]);

  const isAutoConfirmTransaction = useSelector(getIsAutoConfirmTransaction);

  const tokensText = `${tokenAmount} ${tokenSymbol}`;
  console.log('Confirm Token Transaction Base');
  console.log(isAutoConfirmTransaction);
  return (
    <ConfirmTransactionBase
      toAddress={toAddress}
      onEdit={onEdit}
      identiconAddress={tokenAddress}
      title={tokensText}
      subtitleComponent={
        contractExchangeRate === undefined ? (
          <span>{t('noConversionRateAvailable')}</span>
        ) : (
          <UserPreferencedCurrencyDisplay
            value={hexWeiValue}
            type={PRIMARY}
            showEthLogo
            hideLabel
          />
        )
      }
      primaryTotalTextOverride={`${tokensText} + ${ethTransactionTotal} ${nativeCurrency}`}
      primaryTotalTextOverrideMaxAmount={`${tokensText} + ${ethTransactionTotalMaxAmount} ${nativeCurrency}`}
      secondaryTotalTextOverride={secondaryTotalTextOverride}
      isAutoConfirmTransaction={isAutoConfirmTransaction}
    />
  );
}

ConfirmTokenTransactionBase.propTypes = {
  tokenAddress: PropTypes.string,
  toAddress: PropTypes.string,
  tokenAmount: PropTypes.string,
  tokenSymbol: PropTypes.string,
  fiatTransactionTotal: PropTypes.string,
  ethTransactionTotal: PropTypes.string,
  contractExchangeRate: PropTypes.number,
  conversionRate: PropTypes.number,
  currentCurrency: PropTypes.string,
  onEdit: PropTypes.func,
  nativeCurrency: PropTypes.string,
  ethTransactionTotalMaxAmount: PropTypes.string,
};
