/*
  Warnings:

  - Changed the type of `type` on the `working_group_outreach` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "working_group_outreach" DROP COLUMN "type",
ADD COLUMN     "type" "working_group_outreach_type" NOT NULL;
