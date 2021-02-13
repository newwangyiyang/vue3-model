export const storeMutations = {
  user: {
    resetUserState: 'resetUserState',
    updateUserState: 'updateUserState',
    updatedUsername: 'updatedUsername',
    updateAvatarSrc: 'updateAvatarSrc',
    updateToken: 'updateToken',
  },
};

export const storeActions = {
  user: {
    initUserState: 'initUserState',
    updateOnlineStatus: 'updateOnlineStatus',
  },
};

export default {
  storeMutations: storeMutations,
  storeActions: storeActions,
};
