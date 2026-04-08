export const adminValidate = (schema) => async (req, res, next) => {
  const praseBody = await schema.safeParse(req.body);

  if(!praseBody.success){
    return res.status(400).json({
      success: false,
      errors: praseBody.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }))
    })
  }

  req.body = praseBody.data;
  next();
}