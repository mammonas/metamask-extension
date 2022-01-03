import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  displayWarning,
  setFeatureFlag,
  showModal,
  setShowFiatConversionOnTestnetsPreference,
  setShowTestNetworks,
  setAutoLockTimeLimit,
  setThreeBoxSyncingPermission,
  turnThreeBoxSyncingOnAndInitialize,
  setUseNonceField,
  setIpfsGateway,
  setLedgerTransportPreference,
  setDismissSeedBackUpReminder,
  setAutoConfirmOption,
  setAutoConfirmGasLimit,
} from '../../../store/actions';
import { getPreferences } from '../../../selectors';
import { doesUserHaveALedgerAccount } from '../../../ducks/metamask/metamask';
import AdvancedTab from './advanced-tab.component';

export const mapStateToProps = (state) => {
  const {
    appState: { warning },
    metamask,
  } = state;
  const {
    featureFlags: { sendHexData, advancedInlineGas } = {},
    threeBoxSyncingAllowed,
    threeBoxDisabled,
    useNonceField,
    ipfsGateway,
    ledgerTransportType,
    dismissSeedBackUpReminder,
    autoConfirmOption,
  } = metamask;
  const {
    showFiatInTestnets,
    showTestNetworks,
    autoLockTimeLimit,
    autoConfirmGasLimit,
  } = getPreferences(state);

  const userHasALedgerAccount = doesUserHaveALedgerAccount(state);

  return {
    warning,
    sendHexData,
    advancedInlineGas,
    showFiatInTestnets,
    showTestNetworks,
    autoLockTimeLimit,
    threeBoxSyncingAllowed,
    threeBoxDisabled,
    useNonceField,
    ipfsGateway,
    ledgerTransportType,
    dismissSeedBackUpReminder,
    autoConfirmOption,
    autoConfirmGasLimit,
    userHasALedgerAccount,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setHexDataFeatureFlag: (shouldShow) =>
      dispatch(setFeatureFlag('sendHexData', shouldShow)),
    displayWarning: (warning) => dispatch(displayWarning(warning)),
    showResetAccountConfirmationModal: () =>
      dispatch(showModal({ name: 'CONFIRM_RESET_ACCOUNT' })),
    setAdvancedInlineGasFeatureFlag: (shouldShow) =>
      dispatch(setFeatureFlag('advancedInlineGas', shouldShow)),
    setUseNonceField: (value) => dispatch(setUseNonceField(value)),
    setShowFiatConversionOnTestnetsPreference: (value) => {
      return dispatch(setShowFiatConversionOnTestnetsPreference(value));
    },
    setShowTestNetworks: (value) => {
      return dispatch(setShowTestNetworks(value));
    },
    setAutoLockTimeLimit: (value) => {
      return dispatch(setAutoLockTimeLimit(value));
    },
    setAutoConfirmGasLimit: (value) => {
      return dispatch(setAutoConfirmGasLimit(value));
    },
    setThreeBoxSyncingPermission: (newThreeBoxSyncingState) => {
      if (newThreeBoxSyncingState) {
        dispatch(turnThreeBoxSyncingOnAndInitialize());
      } else {
        dispatch(setThreeBoxSyncingPermission(newThreeBoxSyncingState));
      }
    },
    setIpfsGateway: (value) => {
      return dispatch(setIpfsGateway(value));
    },
    setLedgerTransportPreference: (value) => {
      return dispatch(setLedgerTransportPreference(value));
    },
    setDismissSeedBackUpReminder: (value) => {
      return dispatch(setDismissSeedBackUpReminder(value));
    },
    setAutoConfirmOption: (value) => {
      return dispatch(setAutoConfirmOption(value));
    },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AdvancedTab);
