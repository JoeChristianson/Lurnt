CREATE TABLE `User` (
	`id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`handle` varchar(255),
	`passwordHash` varchar(255),
	`googleId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`termsAcceptedAt` timestamp,
	`emailVerified` tinyint NOT NULL DEFAULT 0,
	`emailVerificationToken` varchar(128),
	`emailVerificationExpiresAt` timestamp,
	`bio` varchar(500),
	`websiteUrl` varchar(500),
	`socialLinks` json,
	`theme` varchar(32),
	`isAdmin` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`),
	CONSTRAINT `User_handle_unique` UNIQUE(`handle`),
	CONSTRAINT `User_googleId_unique` UNIQUE(`googleId`)
);
--> statement-breakpoint
CREATE TABLE `Expertise` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `Expertise_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `UserExpertise` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`userId` varchar(128) NOT NULL,
	`expertiseId` varchar(128) NOT NULL,
	`status` enum('active','paused','archived') NOT NULL DEFAULT 'active',
	CONSTRAINT `UserExpertise_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `KnowledgeGraph` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`userExpertiseId` varchar(128) NOT NULL,
	CONSTRAINT `KnowledgeGraph_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Node` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `Node_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `KnowledgeGraphNode` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`knowledgeGraphId` varchar(128) NOT NULL,
	`nodeId` varchar(128) NOT NULL,
	`status` enum('locked','unlocked','completed') NOT NULL DEFAULT 'locked',
	CONSTRAINT `KnowledgeGraphNode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Edge` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`sourceNodeId` varchar(128) NOT NULL,
	`targetNodeId` varchar(128) NOT NULL,
	`relation` enum('prerequisite','related') NOT NULL,
	`justification` text NOT NULL,
	`weight` float NOT NULL DEFAULT 1,
	CONSTRAINT `Edge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ExpertiseNode` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expertiseId` varchar(128) NOT NULL,
	`nodeId` varchar(128) NOT NULL,
	CONSTRAINT `ExpertiseNode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `KnowledgeGraphEdge` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`knowledgeGraphId` varchar(128) NOT NULL,
	`edgeId` varchar(128) NOT NULL,
	CONSTRAINT `KnowledgeGraphEdge_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Resource` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nodeId` varchar(128) NOT NULL,
	`url` varchar(2000) NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` enum('video','article','course','documentation','textbook','exercise','other') NOT NULL,
	`description` text,
	`submittedByUserId` varchar(128),
	CONSTRAINT `Resource_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ResourceVote` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resourceId` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`value` tinyint NOT NULL,
	CONSTRAINT `ResourceVote_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_resource_user_vote` UNIQUE(`resourceId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `NodeQuiz` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nodeId` varchar(128) NOT NULL,
	`questions` json NOT NULL,
	CONSTRAINT `NodeQuiz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NodeQuizResult` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nodeQuizId` varchar(128) NOT NULL,
	`knowledgeGraphNodeId` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`answers` json NOT NULL,
	`score` float NOT NULL,
	`passed` boolean NOT NULL,
	CONSTRAINT `NodeQuizResult_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NodeAssessment` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nodeId` varchar(128) NOT NULL,
	`prompt` text NOT NULL,
	`gradingInstructions` text NOT NULL,
	CONSTRAINT `NodeAssessment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NodeAssessmentResult` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`nodeAssessmentId` varchar(128) NOT NULL,
	`knowledgeGraphNodeId` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`conversation` json NOT NULL,
	`passed` boolean NOT NULL,
	CONSTRAINT `NodeAssessmentResult_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ExpertiseQuiz` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expertiseId` varchar(128) NOT NULL,
	`questions` json NOT NULL,
	CONSTRAINT `ExpertiseQuiz_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ExpertiseQuizResult` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expertiseQuizId` varchar(128) NOT NULL,
	`userExpertiseId` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`answers` json NOT NULL,
	`score` float NOT NULL,
	`passed` boolean NOT NULL,
	CONSTRAINT `ExpertiseQuizResult_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ExpertiseAssessment` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expertiseId` varchar(128) NOT NULL,
	`prompt` text NOT NULL,
	`gradingInstructions` text NOT NULL,
	CONSTRAINT `ExpertiseAssessment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ExpertiseAssessmentResult` (
	`id` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expertiseAssessmentId` varchar(128) NOT NULL,
	`userExpertiseId` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`conversation` json NOT NULL,
	`passed` boolean NOT NULL,
	CONSTRAINT `ExpertiseAssessmentResult_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `UserExpertise` ADD CONSTRAINT `UserExpertise_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `UserExpertise` ADD CONSTRAINT `UserExpertise_expertiseId_Expertise_id_fk` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `KnowledgeGraph` ADD CONSTRAINT `KnowledgeGraph_userExpertiseId_UserExpertise_id_fk` FOREIGN KEY (`userExpertiseId`) REFERENCES `UserExpertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `KnowledgeGraphNode` ADD CONSTRAINT `KnowledgeGraphNode_knowledgeGraphId_KnowledgeGraph_id_fk` FOREIGN KEY (`knowledgeGraphId`) REFERENCES `KnowledgeGraph`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `KnowledgeGraphNode` ADD CONSTRAINT `KnowledgeGraphNode_nodeId_Node_id_fk` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_sourceNodeId_Node_id_fk` FOREIGN KEY (`sourceNodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_targetNodeId_Node_id_fk` FOREIGN KEY (`targetNodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseNode` ADD CONSTRAINT `ExpertiseNode_expertiseId_Expertise_id_fk` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseNode` ADD CONSTRAINT `ExpertiseNode_nodeId_Node_id_fk` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `KnowledgeGraphEdge` ADD CONSTRAINT `KnowledgeGraphEdge_knowledgeGraphId_KnowledgeGraph_id_fk` FOREIGN KEY (`knowledgeGraphId`) REFERENCES `KnowledgeGraph`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `KnowledgeGraphEdge` ADD CONSTRAINT `KnowledgeGraphEdge_edgeId_Edge_id_fk` FOREIGN KEY (`edgeId`) REFERENCES `Edge`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_nodeId_Node_id_fk` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_submittedByUserId_User_id_fk` FOREIGN KEY (`submittedByUserId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ResourceVote` ADD CONSTRAINT `ResourceVote_resourceId_Resource_id_fk` FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ResourceVote` ADD CONSTRAINT `ResourceVote_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeQuiz` ADD CONSTRAINT `NodeQuiz_nodeId_Node_id_fk` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeQuizResult` ADD CONSTRAINT `NodeQuizResult_nodeQuizId_NodeQuiz_id_fk` FOREIGN KEY (`nodeQuizId`) REFERENCES `NodeQuiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeQuizResult` ADD CONSTRAINT `NodeQuizResult_knowledgeGraphNodeId_KnowledgeGraphNode_id_fk` FOREIGN KEY (`knowledgeGraphNodeId`) REFERENCES `KnowledgeGraphNode`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeQuizResult` ADD CONSTRAINT `NodeQuizResult_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeAssessment` ADD CONSTRAINT `NodeAssessment_nodeId_Node_id_fk` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeAssessmentResult` ADD CONSTRAINT `NodeAssessmentResult_nodeAssessmentId_NodeAssessment_id_fk` FOREIGN KEY (`nodeAssessmentId`) REFERENCES `NodeAssessment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeAssessmentResult` ADD CONSTRAINT `NodeAssessmentResult_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NodeAssessmentResult` ADD CONSTRAINT `NodeAssessResult_kgNodeId_KGNode_id_fk` FOREIGN KEY (`knowledgeGraphNodeId`) REFERENCES `KnowledgeGraphNode`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseQuiz` ADD CONSTRAINT `ExpertiseQuiz_expertiseId_Expertise_id_fk` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseQuizResult` ADD CONSTRAINT `ExpertiseQuizResult_expertiseQuizId_ExpertiseQuiz_id_fk` FOREIGN KEY (`expertiseQuizId`) REFERENCES `ExpertiseQuiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseQuizResult` ADD CONSTRAINT `ExpertiseQuizResult_userExpertiseId_UserExpertise_id_fk` FOREIGN KEY (`userExpertiseId`) REFERENCES `UserExpertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseQuizResult` ADD CONSTRAINT `ExpertiseQuizResult_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessment` ADD CONSTRAINT `ExpertiseAssessment_expertiseId_Expertise_id_fk` FOREIGN KEY (`expertiseId`) REFERENCES `Expertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` ADD CONSTRAINT `ExpertiseAssessmentResult_userExpertiseId_UserExpertise_id_fk` FOREIGN KEY (`userExpertiseId`) REFERENCES `UserExpertise`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` ADD CONSTRAINT `ExpertiseAssessmentResult_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ExpertiseAssessmentResult` ADD CONSTRAINT `ExpAssessResult_assessId_ExpAssess_id_fk` FOREIGN KEY (`expertiseAssessmentId`) REFERENCES `ExpertiseAssessment`(`id`) ON DELETE no action ON UPDATE no action;