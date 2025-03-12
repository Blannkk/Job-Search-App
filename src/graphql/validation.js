export const isValid = (schema, args) => {
  const result = schema.validate(args, {
    abortEarly: false,
  });

  if (result.error) {
    let message = result.error.details.map(
      (err) => err.message
    );
    throw new Error(message);
  }
};
