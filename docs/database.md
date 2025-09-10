# Database Schema Documentation

This document provides detailed information on the database schema used for managing clinics, users, subscription plans, and verification OTPs.

## Overview

The schema is implemented using Prisma ORM, with PostgreSQL as the database provider. It includes models for `Clinic`, `User`, `SubscriptionPlan`, and `VerificationOTP`, along with two enumerations: `Role` and `SubscriptionStatus`.

### Generator and Datasource

* **Generator:**

  * `provider`: `prisma-client-js` for generating Prisma Client in JavaScript.
* **Datasource:**

  * `provider`: `postgresql`
  * `url`: Uses an environment variable (`DATABASE_URL`) for the database connection.

## Models

### 1. Clinic

Stores information about clinics and their subscription details.

* **Fields:**

  * `id` (Int): Primary key, auto-incremented.
  * `email` (String): Unique email address for the clinic.
  * `subscriptionStatus` (SubscriptionStatus): Status of the clinic's subscription. Defaults to `TRIAL`.
  * `subscriptionEndsOn` (DateTime): The expiration date of the subscription.
  * `createdOn` (DateTime): Timestamp when the clinic was created. Defaults to `now()`.
  * `name` (String): Name of the clinic.
  * `address` (String?): Optional field for the clinic address.
  * `phone` (String?): Optional field for the clinic phone number.
  * `subscriptionPlanId` (Int?): Foreign key linking to a subscription plan.
  * `subscriptionPlan` (SubscriptionPlan?): Relation to the `SubscriptionPlan` model.
  * `Users` (User\[]): One-to-many relation with `User` model.
  * `createdAt` (DateTime): Record creation timestamp. Defaults to `now()`.
  * `updatedAt` (DateTime): Timestamp of the last update. Automatically updated.

* **Relations:**

  * `subscriptionPlan`: Many-to-one relation with `SubscriptionPlan`.
  * `Users`: One-to-many relation with `User`.

### 2. User

Represents individual users associated with a clinic.

* **Fields:**

  * `id` (Int): Primary key, auto-incremented.
  * `firstName` (String): First name of the user.
  * `lastName` (String): Last name of the user.
  * `email` (String?): Unique email address (optional).
  * `password` (String): Encrypted password of the user.
  * `role` (Role): Role of the user. Defaults to `RECEPTIONIST`.
  * `clinicId` (Int): Foreign key linking to a clinic.
  * `Clinic` (Clinic): Relation to the `Clinic` model.
  * `createdAt` (DateTime): Record creation timestamp. Defaults to `now()`.
  * `updatedAt` (DateTime): Timestamp of the last update. Automatically updated.
  * `lastLoginAt` (DateTime?): Nullable field for tracking the last login timestamp.

* **Relations:**

  * `Clinic`: Many-to-one relation with `Clinic`.

### 3. SubscriptionPlan

Defines available subscription plans and their features.

* **Fields:**

  * `id` (Int): Primary key, auto-incremented.
  * `name` (String): Unique name of the subscription plan (e.g., Basic, Pro, Business).
  * `features` (String\[]): List of features included in the plan.
  * `priceMonthly` (Float): Monthly cost of the plan.
  * `priceYearly` (Float): Yearly cost of the plan.
  * `Clinics` (Clinic\[]): One-to-many relation with `Clinic`.

* **Relations:**

  * `Clinics`: One-to-many relation with `Clinic`.

### 4. VerificationOTP

Handles temporary OTP (One-Time Password) data for verification purposes.

* **Fields:**

  * `id` (Int): Primary key, auto-incremented.
  * `firstName` (String): First name of the user.
  * `lastName` (String): Last name of the user.
  * `email` (String): Unique email address.
  * `password` (String): Encrypted password.
  * `clinicName` (String): Name of the clinic associated with the OTP.
  * `otp` (String): One-time password for verification.
  * `expiresAt` (DateTime): Expiry timestamp of the OTP.
  * `deleteAfter` (DateTime): Timestamp after which the record should be deleted.
  * `createdAt` (DateTime): Record creation timestamp. Defaults to `now()`.
  * `updatedAt` (DateTime): Timestamp of the last update. Automatically updated.

## Enums

### Role

Defines the role of a user within the system.

* Values:

  * `ADMIN`
  * `DOCTOR`
  * `RECEPTIONIST`

### SubscriptionStatus

Tracks the current status of a clinic's subscription.

* Values:

  * `ACTIVE`
  * `TRIAL`
  * `EXPIRED`
  * `CANCELED`

## Relationships

* **Clinic - User:** One-to-many relation. A clinic can have multiple users.
* **Clinic - SubscriptionPlan:** Many-to-one relation. A clinic can subscribe to one subscription plan.
* **SubscriptionPlan - Clinic:** One-to-many relation. A subscription plan can be associated with multiple clinics.

## Timestamps

* All models include `createdAt` and `updatedAt` fields for record creation and update tracking.

## Summary

This schema is designed to support the operational needs of a clinic management system, including user roles, subscription management, and temporary OTP verification. It uses relations effectively to ensure data integrity and maintain scalability.
