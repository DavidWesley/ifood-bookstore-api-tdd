CREATE TABLE `books_rental` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`book_id` text(36) NOT NULL,
	`user_id` text(36) NOT NULL,
	`rented_at` integer,
	`rental_time` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`subtitle` text(255) NOT NULL,
	`author` text(255) NOT NULL,
	`publishing_company` text(255) NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_rental_id_unique` ON `books_rental` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `books_id_unique` ON `books` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_idx` ON `books` (`title`,`author`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);