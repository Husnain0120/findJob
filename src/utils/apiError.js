class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong", // Corrected the spelling of "Somthing" to "Something"
        errors = [],
        stack = "" // Corrected the parameter name "statck" to "stack"
    ) {
        super(message); // No need to set this.message again as super(message) already sets it
        this.errors = errors;
        this.statusCode = statusCode;
        this.data = null;

        if (stack) { // Corrected the parameter name "statck" to "stack"
            this.stack = stack; // Corrected the assignment from "statck" to "stack"
        } else {
            Error.captureStackTrace(this, this.constructor); // Fixed the spacing for readability
        }
    }
}
export { apiError }; // Fixed the spacing for readability
