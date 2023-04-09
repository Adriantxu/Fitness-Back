/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Injury` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgressPicture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sleep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workoutId` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Injury" DROP CONSTRAINT "Injury_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressPicture" DROP CONSTRAINT "ProgressPicture_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sleep" DROP CONSTRAINT "Sleep_userId_fkey";

-- DropForeignKey
ALTER TABLE "Supplement" DROP CONSTRAINT "Supplement_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_exerciseId_fkey";

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "workoutId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutPlan" DROP COLUMN "exerciseId",
DROP COLUMN "reps",
DROP COLUMN "sets",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Injury";

-- DropTable
DROP TABLE "ProgressPicture";

-- DropTable
DROP TABLE "Sleep";

-- DropTable
DROP TABLE "Supplement";

-- CreateTable
CREATE TABLE "Workout_Set" (
    "id" SERIAL NOT NULL,
    "workoutPlanId" INTEGER NOT NULL,
    "setId" INTEGER NOT NULL,

    CONSTRAINT "Workout_Set_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "WorkoutPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Set" ADD CONSTRAINT "Workout_Set_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "WorkoutPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Set" ADD CONSTRAINT "Workout_Set_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
