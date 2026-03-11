ALTER TABLE `ExpertiseAssessmentResult` MODIFY COLUMN `expertiseAssessmentId` varchar(128);--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` MODIFY COLUMN `passed` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` ADD `status` enum('in_progress','completed') DEFAULT 'in_progress' NOT NULL;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` ADD `summary` json;