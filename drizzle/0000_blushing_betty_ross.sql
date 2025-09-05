CREATE TYPE "public"."campaign_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'approved', 'published');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('pending', 'active', 'completed', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('business', 'influencer');--> statement-breakpoint
CREATE TABLE "mic-hub_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer NOT NULL,
	"engagement" integer,
	"reach" integer,
	"roi" numeric(10, 2),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mic-hub_application" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"influencer_id" integer NOT NULL,
	"status" "campaign_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mic-hub_campaign" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"target_audience" text,
	"goals" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mic-hub_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract_id" integer NOT NULL,
	"title" varchar(256),
	"description" text,
	"url" varchar(512),
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mic-hub_contract" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"influencer_id" integer NOT NULL,
	"terms" text NOT NULL,
	"status" "contract_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mic-hub_payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mic-hub_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(256) NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"role" "user_role" NOT NULL,
	"bio" text,
	"website" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "mic-hub_user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "mic-hub_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "mic-hub_analytics" ADD CONSTRAINT "mic-hub_analytics_content_id_mic-hub_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."mic-hub_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_application" ADD CONSTRAINT "mic-hub_application_campaign_id_mic-hub_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."mic-hub_campaign"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_application" ADD CONSTRAINT "mic-hub_application_influencer_id_mic-hub_user_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."mic-hub_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_campaign" ADD CONSTRAINT "mic-hub_campaign_business_id_mic-hub_user_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."mic-hub_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_content" ADD CONSTRAINT "mic-hub_content_contract_id_mic-hub_contract_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."mic-hub_contract"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_contract" ADD CONSTRAINT "mic-hub_contract_campaign_id_mic-hub_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."mic-hub_campaign"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_contract" ADD CONSTRAINT "mic-hub_contract_influencer_id_mic-hub_user_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."mic-hub_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mic-hub_payment" ADD CONSTRAINT "mic-hub_payment_contract_id_mic-hub_contract_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."mic-hub_contract"("id") ON DELETE no action ON UPDATE no action;