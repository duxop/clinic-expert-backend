# IMP - need to add that only 1 login instance at a time.

## Common Use in RESTful APIs:

    2xx for Success: E.g., 200 OK, 201 Created.
    4xx for Client Errors: E.g., 400 Bad Request, 401 Unauthorized, 404 Not Found.
    5xx for Server Errors: E.g., 500 Internal Server Error, 503 Service Unavailable.


# auth route /api/auth

    POST   /api/auth/signup     ✅
    POST   /api/auth/verify-email  ✅
    POST   /api/auth/resend-otp       ✅  
    POST   /api/auth/signin        ✅
    POST   /api/auth/forgot-password  // we will get the email and the new password and create an otp in verify-email and same as sign up
    POST   /api/user/signout
    DELETE /api/auth/:id

# user route /api/user

        PUT     /api/user/reset-password    ✅
        
# receptionist route /api/receptionist

        GET     /api/receptionist           ✅   //get receptionist profile (firstName, lastName, phone, email, Address, Age)
        PUT     /api/receptionist           ✅   //update receptionist profile (firstName, lastName, phone, email, Address, Age)


# clinic route

    GET     /api/clinic/all           ✅
    POST    /api/clinic/              ✅   //add staff - doctor and patient
    GET     /api/clinic/:id/qr-code   ✅   //generate QR code for patient registration
    GET     /api/clinic/:id
    PUT     /api/clinic/:id
    GET     /api/clinic               ✅   //get clinic details (email, name, address, phone, workHours, logo)
    PUT     /api/clinic               ✅   //update clinic details (email, name, address, phone, workHours, logo)
    DELETE  /api/clinic/:id
    DELETE  /api/clinic/:clinicId

# patient route - /api/patient

    GET    /api/patient/all           ✅
    POST   /api/patient/             ✅
    POST   /api/patient/register/:clinicId  ✅  //public patient registration via QR code (no auth)
    GET    /api/patient/:id
    PUT    /api/patient/:id
    DELETE /api/patient/:id

# doctor route - /api/doctor

    GET    /api/doctor/:clinicID
    GET    /api/doctor/:id
    PUT    /api/doctor/:id
    DELETE /api/doctor/:id
    
# Appointment - /api/appointment

    GET    /api/appointments/:clinicID     
    GET    /api/appointments/:id
    POST   /api/appointments
    GET    /api/appointments/:id
    DELETE /api/appointments/:id
