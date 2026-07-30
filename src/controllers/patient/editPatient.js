const { prisma } = require("../../config/database");
const validator = require("validator");

const ALLOWED_GENDERS = ["MALE", "FEMALE", "OTHER", "NA"];
const ALLOWED_BLOOD_GROUPS = [
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
];

const editPatient = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid patient id" });
    }

    const existing = await prisma.Patient.findFirst({
      where: { id, clinicId, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      emergencyContact,
      gender,
      age,
      bloodGroup,
      treatmentsLeft,
    } = req.body;

    const updateData = {};

    if (firstName !== undefined) {
      const trimmed = typeof firstName === "string" ? firstName.trim() : "";
      if (!trimmed || !validator.isAlpha(trimmed)) {
        return res.status(400).json({
          error: "First name must contain only alphabetic characters.",
        });
      }
      if (trimmed.length > 50) {
        return res
          .status(400)
          .json({ error: "First name is too long (maximum 50 characters)." });
      }
      updateData.firstName = trimmed.toUpperCase();
    }

    if (lastName !== undefined) {
      if (lastName === null || lastName === "") {
        updateData.lastName = null;
      } else {
        const trimmed = String(lastName).trim();
        if (!validator.isAlpha(trimmed)) {
          return res.status(400).json({
            error: "Last name must contain only alphabetic characters.",
          });
        }
        if (trimmed.length > 50) {
          return res
            .status(400)
            .json({ error: "Last name is too long (maximum 50 characters)." });
        }
        updateData.lastName = trimmed.toUpperCase();
      }
    }

    if (email !== undefined) {
      if (email === null || email === "") {
        updateData.email = null;
      } else {
        const trimmed = String(email).trim();
        if (!validator.isEmail(trimmed)) {
          return res.status(400).json({ error: "Invalid email address." });
        }
        updateData.email = validator.normalizeEmail(trimmed);
      }
    }

    if (phone !== undefined) {
      const trimmed = typeof phone === "string" ? phone.trim() : "";
      if (!trimmed || !validator.isMobilePhone(trimmed, "any")) {
        return res.status(400).json({ error: "Invalid phone number." });
      }
      if (trimmed.length > 15) {
        return res
          .status(400)
          .json({ error: "Phone number is too long (maximum 15 digits)." });
      }
      updateData.phone = trimmed;
    }

    if (emergencyContact !== undefined) {
      if (emergencyContact === null || emergencyContact === "") {
        updateData.emergencyContact = null;
      } else {
        const trimmed = String(emergencyContact).trim();
        if (!validator.isMobilePhone(trimmed, "any")) {
          return res
            .status(400)
            .json({ error: "Invalid emergency contact number." });
        }
        if (trimmed.length > 15) {
          return res.status(400).json({
            error: "Emergency contact number is too long (maximum 15 digits).",
          });
        }
        updateData.emergencyContact = trimmed;
      }
    }

    if (gender !== undefined) {
      const normalized = String(gender).trim().toUpperCase();
      if (!ALLOWED_GENDERS.includes(normalized)) {
        return res.status(400).json({
          error: `Gender must be one of: ${ALLOWED_GENDERS.join(", ")}`,
        });
      }
      updateData.gender = normalized;
    }

    if (age !== undefined) {
      if (age === null || age === "") {
        updateData.age = null;
      } else {
        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
          return res.status(400).json({ error: "Invalid age." });
        }
        updateData.age = parsedAge;
      }
    }

    if (bloodGroup !== undefined) {
      if (bloodGroup === null || bloodGroup === "") {
        updateData.bloodGroup = null;
      } else {
        const normalized = String(bloodGroup).trim().toUpperCase();
        if (!ALLOWED_BLOOD_GROUPS.includes(normalized)) {
          return res.status(400).json({
            error: `Blood group must be one of: ${ALLOWED_BLOOD_GROUPS.join(", ")}`,
          });
        }
        updateData.bloodGroup = normalized;
      }
    }

    if (treatmentsLeft !== undefined) {
      const parsed = parseInt(treatmentsLeft);
      if (isNaN(parsed) || parsed < 0) {
        return res
          .status(400)
          .json({ error: "treatmentsLeft must be a non-negative integer." });
      }
      updateData.treatmentsLeft = parsed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    // Prevent duplicate phone/email within the same clinic (active patients only)
    if (updateData.phone || updateData.email) {
      const orFilters = [];
      if (updateData.phone) orFilters.push({ phone: updateData.phone });
      if (updateData.email) orFilters.push({ email: updateData.email });

      const duplicate = await prisma.Patient.findFirst({
        where: {
          clinicId,
          isDeleted: false,
          NOT: { id },
          OR: orFilters,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          error:
            "Another patient with this email or phone number already exists in this clinic",
        });
      }
    }

    const patient = await prisma.Patient.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Error editing patient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = editPatient;
