export const catchAsyncError = (cbfunction) => {
  return (req, res, next) => {
    Promise.resolve(cbfunction(req, res, next)).catch(next);
  };
};
