# post - /signup
    body -

    {
    "firstName": "shivam",
    "lastName": "sangwan",
    "email": "sangwan.shivam10@gmail.com",
    "clinicName": "abc",
    "password": "shivam"
    }   

    checks for all the fields if not gives error 400 - "Please fill all the details"

    then, checks if user exists, if exists - status(409).json({ error: "Email already exists"})

    hashes the password.

    then, creates a random OTP and enters the details  in VerificationOTP table.

