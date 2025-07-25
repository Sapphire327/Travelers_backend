-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tours" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "datesFrom" TIMESTAMP(3) NOT NULL,
    "datesTo" TIMESTAMP(3) NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "mapCode" TEXT,
    "startPlace" TEXT NOT NULL,
    "otherInfo" TEXT,
    "isEquipmentProvided" BOOLEAN NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "fio" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toursId" INTEGER,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expDate" TIMESTAMP(3) NOT NULL,
    "usersId" INTEGER,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_toursId_fkey" FOREIGN KEY ("toursId") REFERENCES "Tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
