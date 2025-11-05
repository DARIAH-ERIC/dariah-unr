-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RoleType" ADD VALUE 'national_representative_deputy';
ALTER TYPE "RoleType" ADD VALUE 'national_consortium_contact';
ALTER TYPE "RoleType" ADD VALUE 'cooperating_partner_contact';
