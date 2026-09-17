// Length of the free trial given to every new clinic on signup.
const TRIAL_DAYS = 7;

const getTrialEndDate = () => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + TRIAL_DAYS);
  return endDate;
};

module.exports = getTrialEndDate;
