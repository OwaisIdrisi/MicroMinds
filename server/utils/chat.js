export const normalizeParticipantIds = (firstUserId, secondUserId) => {
    const ids = [String(firstUserId), String(secondUserId)].sort();
    return ids;
};

export const buildConversationKey = (firstUserId, secondUserId) => {
    return normalizeParticipantIds(firstUserId, secondUserId).join(':');
};
