const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    err.statusCode = err.statusCode || res.statusCode;
    next(err);
  });
};

export default asyncHandler;
