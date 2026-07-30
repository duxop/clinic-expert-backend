const formatAppointmentDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatAppointmentTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

const patientDisplayName = (patient) => {
  return [patient?.firstName, patient?.lastName].filter(Boolean).join(" ").trim() || "Patient";
};

const doctorDisplayName = (doctor) => {
  const name = [doctor?.firstName, doctor?.lastName].filter(Boolean).join(" ").trim();
  return name || "Doctor";
};

/**
 * Booking template params:
 * {{1}} name, {{2}} doctor, {{3}} date, {{4}} time, {{5}} clinic, {{6}} address
 */
const buildBookingParams = ({ patient, doctor, clinic, scheduledTime }) => {
  return [
    patientDisplayName(patient),
    doctorDisplayName(doctor),
    formatAppointmentDate(scheduledTime),
    formatAppointmentTime(scheduledTime),
    clinic?.name || "Clinic",
    clinic?.address || "—",
  ];
};

/**
 * Feedback template params:
 * {{1}} name, {{2}} doctor, {{3}} clinic, {{4}} feedbackLink
 */
const buildFeedbackParams = ({ patient, doctor, clinic }) => {
  return [
    patientDisplayName(patient),
    doctorDisplayName(doctor),
    clinic?.name || "Clinic",
    clinic?.feedbackLink || "",
  ];
};

module.exports = {
  buildBookingParams,
  buildFeedbackParams,
  formatAppointmentDate,
  formatAppointmentTime,
};
