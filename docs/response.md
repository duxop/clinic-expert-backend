/api/auth/signup

400 - field is missing.
409 - Email already exists
429 - `New OTP can be generated after ${waitTime} seconds.`,
500 - internal error

200 - Verification OTP sent. Please check your inbox.

/api/auth/verify-email

400 - Invalid or OTP expired
500 - Failed to create clinic
201 - Email verified successfully