import React from 'react';

import ConfirmTransactionBase from '.';

export default {
  title: 'Confirmation Screens',
  id: __filename,
};

const PageSet = ({ children }) => {
  return children;
};

export const ConfirmTransactionBaseComponent = () => {
  console.log('Confirm Transaction Base');
  return (
    <PageSet>
      <ConfirmTransactionBase />
    </PageSet>
  );
};
