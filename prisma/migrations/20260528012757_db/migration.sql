-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Places" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preview" TEXT,
    "images" TEXT NOT NULL,
    "mapCode" TEXT,
    "otherInfo" TEXT
);

-- CreateTable
CREATE TABLE "Tours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datesFrom" DATETIME NOT NULL,
    "datesTo" DATETIME NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "startPlace" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "placesId" INTEGER NOT NULL,
    CONSTRAINT "Tours_placesId_fkey" FOREIGN KEY ("placesId") REFERENCES "Places" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "fio" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONSIDERING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toursId" INTEGER,
    CONSTRAINT "Applications_toursId_fkey" FOREIGN KEY ("toursId") REFERENCES "Tours" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "refreshToken" TEXT NOT NULL,
    "expDate" DATETIME NOT NULL,
    "usersId" INTEGER NOT NULL,
    CONSTRAINT "Tokens_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");
