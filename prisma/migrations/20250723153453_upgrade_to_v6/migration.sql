-- AlterTable
ALTER TABLE "_BodyToRole" ADD CONSTRAINT "_BodyToRole_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BodyToRole_AB_unique";

-- AlterTable
ALTER TABLE "_CountryToInstitution" ADD CONSTRAINT "_CountryToInstitution_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CountryToInstitution_AB_unique";

-- AlterTable
ALTER TABLE "_CountryToService" ADD CONSTRAINT "_CountryToService_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CountryToService_AB_unique";

-- AlterTable
ALTER TABLE "_CountryToSoftware" ADD CONSTRAINT "_CountryToSoftware_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CountryToSoftware_AB_unique";

-- AlterTable
ALTER TABLE "_InstitutionToPerson" ADD CONSTRAINT "_InstitutionToPerson_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_InstitutionToPerson_AB_unique";
