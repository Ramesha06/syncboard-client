/**
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.') || '(root)',
            message: issue.message,
        }));

        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Validation Failed',
            errors,
        });
    }

    req.body = result.data;
    return next();
};

export default validate;