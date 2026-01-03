CREATE TABLE `education` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionEn` varchar(255) NOT NULL,
	`institutionAr` varchar(255),
	`degreeEn` varchar(255) NOT NULL,
	`degreeAr` varchar(255),
	`fieldEn` varchar(255),
	`fieldAr` varchar(255),
	`startDate` date,
	`endDate` date,
	`isCurrent` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyEn` varchar(255) NOT NULL,
	`companyAr` varchar(255),
	`positionEn` varchar(255) NOT NULL,
	`positionAr` varchar(255),
	`locationEn` varchar(255),
	`locationAr` varchar(255),
	`descriptionEn` text,
	`descriptionAr` text,
	`responsibilitiesEn` text,
	`responsibilitiesAr` text,
	`startDate` date,
	`endDate` date,
	`isCurrent` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullNameEn` varchar(255) DEFAULT 'Yasser Sallam',
	`fullNameAr` varchar(255) DEFAULT 'ياسر سلام',
	`titleEn` varchar(255) DEFAULT 'Technical Creative & Production Expert',
	`titleAr` varchar(255) DEFAULT 'خبير تقني إبداعي وإنتاجي',
	`bioEn` text,
	`bioAr` text,
	`summaryEn` text,
	`summaryAr` text,
	`email` varchar(320) DEFAULT 'yassersalllam@gmail.com',
	`phone` varchar(50) DEFAULT '+201000986942',
	`whatsapp` varchar(50) DEFAULT '+201000986942',
	`linkedinUrl` varchar(500) DEFAULT 'https://linkedin.com/in/yasserious',
	`locationEn` varchar(255) DEFAULT '10th of Ramadan City, Egypt',
	`locationAr` varchar(255) DEFAULT 'مدينة العاشر من رمضان، مصر',
	`avatarUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personal_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255),
	`descriptionEn` text,
	`descriptionAr` text,
	`imageUrl` varchar(500),
	`category` varchar(100),
	`technologies` text,
	`projectUrl` varchar(500),
	`isFeatured` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewerName` varchar(255) NOT NULL,
	`reviewerEmail` varchar(320),
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`isApproved` boolean DEFAULT false,
	`isFeatured` boolean DEFAULT false,
	`adminReply` text,
	`repliedAt` timestamp,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`categoryEn` varchar(100),
	`categoryAr` varchar(100),
	`proficiency` int DEFAULT 80,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `talents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255),
	`descriptionEn` text,
	`descriptionAr` text,
	`icon` varchar(100),
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `talents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255),
	`companyEn` varchar(255),
	`companyAr` varchar(255),
	`contentEn` text NOT NULL,
	`contentAr` text,
	`avatarUrl` varchar(500),
	`linkedinUrl` varchar(500),
	`isFeatured` boolean DEFAULT false,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
