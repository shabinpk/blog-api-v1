const updateUserBlockedStatus = async (User, userId, isBlocked) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.isBlocked = isBlocked;
      await user.save();
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    updateUserBlockedStatus,
  };
  