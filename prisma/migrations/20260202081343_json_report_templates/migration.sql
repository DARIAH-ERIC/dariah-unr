-- AlterTable
ALTER TABLE "report_campaigns" ADD COLUMN     "facultative_questions_list_template" JSONB,
ADD COLUMN     "narrative_questions_list_template" JSONB;

-- AlterTable
ALTER TABLE "working_group_reports" ADD COLUMN     "facultative_questions_list" JSONB,
ADD COLUMN     "narrative_questions_list" JSONB,
ALTER COLUMN "facultative_questions" DROP NOT NULL,
ALTER COLUMN "narrative_report" DROP NOT NULL;
