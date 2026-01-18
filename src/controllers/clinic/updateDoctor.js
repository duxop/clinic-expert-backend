const { prisma } = require("../../config/database");

const updateDoctor = async (req, res) => {
  try {
    const { clinicId, id: userId, role } = req.userData;
    const { firstName, lastName, email, profilePicture, degree, specialization, experience } = req.body;

    // Validate required fields
    if (!firstName) {
      return res.status(400).json({ error: "First Name is required" });
    }

    // Find the doctor record
    // If user is DOCTOR, find by userId; if ADMIN, they can update any doctor in their clinic
    let doctor;
    
    if (role === "DOCTOR") {
      // Doctor can only update their own profile
      doctor = await prisma.Doctor.findFirst({
        where: {
          userId: userId,
          clinicId: clinicId,
          isDeleted: false,
        },
      });
    } else if (role === "ADMIN") {
      // Admin can update any doctor in their clinic
      // If doctorId is provided in body, use it; otherwise use userId
      const doctorId = req.body.id || req.body.doctorId;
      if (doctorId) {
        doctor = await prisma.Doctor.findFirst({
          where: {
            id: parseInt(doctorId),
            clinicId: clinicId,
            isDeleted: false,
          },
        });
      } else {
        // If no doctorId provided, find by userId
        doctor = await prisma.Doctor.findFirst({
          where: {
            userId: userId,
            clinicId: clinicId,
            isDeleted: false,
          },
        });
      }
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Prepare update data (only include fields that are provided)
    const updateData = {
      firstName,
    };
    if (lastName !== undefined) updateData.lastName = lastName || null;
    if (email !== undefined) updateData.email = email || null;
    if (profilePicture !== undefined) {
      // Validate profile picture size (base64 images can be large)
      // Limit to 2MB base64 string (~1.5MB actual image size) to prevent database timeouts
      if (profilePicture && profilePicture.length > 2 * 1024 * 1024) {
        return res.status(400).json({ 
          error: "Profile picture is too large. Please compress the image to under 1.5MB and try again." 
        });
      }
      updateData.profilePicture = profilePicture || null;
    }
    if (degree !== undefined) updateData.degree = degree || null;
    if (specialization !== undefined) updateData.specialization = specialization || null;
    if (experience !== undefined) {
      // Validate experience is a number if provided
      if (experience !== null && experience !== "" && isNaN(parseInt(experience))) {
        return res.status(400).json({ error: "Experience must be a number" });
      }
      updateData.experience = experience ? parseInt(experience) : null;
    }

    // Update the doctor record
    const updatedDoctor = await prisma.Doctor.update({
      where: {
        id: doctor.id,
      },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P5010' || error.message?.includes('fetch failed') || error.message?.includes('Cannot fetch data')) {
      return res.status(503).json({ 
        error: "Database connection timeout. The image may be too large. Please compress the image to under 2MB and try again." 
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "A doctor with this information already exists." 
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: "Doctor record not found." 
      });
    }
    
    return res.status(500).json({ 
      error: "Failed to update doctor profile",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = updateDoctor;

