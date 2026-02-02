/*
  Warnings:

  - You are about to drop the column `facultative_questions_template` on the `report_campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `narrative_report_template` on the `report_campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `facultative_questions` on the `working_group_reports` table. All the data in the column will be lost.
  - You are about to drop the column `narrative_report` on the `working_group_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "report_campaigns" DROP COLUMN "facultative_questions_template",
DROP COLUMN "narrative_report_template";

-- AlterTable
ALTER TABLE "working_group_reports" DROP COLUMN "facultative_questions",
DROP COLUMN "narrative_report";
