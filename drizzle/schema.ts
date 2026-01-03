import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Personal information for portfolio owner (bilingual)
 */
export const personalInfo = mysqlTable("personal_info", {
  id: int("id").autoincrement().primaryKey(),
  fullNameEn: varchar("fullNameEn", { length: 255 }).default("Yasser Sallam"),
  fullNameAr: varchar("fullNameAr", { length: 255 }).default("ياسر سلام"),
  titleEn: varchar("titleEn", { length: 255 }).default("Technical Creative & Production Expert"),
  titleAr: varchar("titleAr", { length: 255 }).default("خبير تقني إبداعي وإنتاجي"),
  bioEn: text("bioEn"),
  bioAr: text("bioAr"),
  summaryEn: text("summaryEn"),
  summaryAr: text("summaryAr"),
  email: varchar("email", { length: 320 }).default("yassersalllam@gmail.com"),
  phone: varchar("phone", { length: 50 }).default("+201000986942"),
  whatsapp: varchar("whatsapp", { length: 50 }).default("+201000986942"),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }).default("https://linkedin.com/in/yasserious"),
  locationEn: varchar("locationEn", { length: 255 }).default("10th of Ramadan City, Egypt"),
  locationAr: varchar("locationAr", { length: 255 }).default("مدينة العاشر من رمضان، مصر"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PersonalInfo = typeof personalInfo.$inferSelect;
export type InsertPersonalInfo = typeof personalInfo.$inferInsert;

/**
 * Work experiences (bilingual)
 */
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  companyEn: varchar("companyEn", { length: 255 }).notNull(),
  companyAr: varchar("companyAr", { length: 255 }),
  positionEn: varchar("positionEn", { length: 255 }).notNull(),
  positionAr: varchar("positionAr", { length: 255 }),
  locationEn: varchar("locationEn", { length: 255 }),
  locationAr: varchar("locationAr", { length: 255 }),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  responsibilitiesEn: text("responsibilitiesEn"), // JSON array stored as text
  responsibilitiesAr: text("responsibilitiesAr"), // JSON array stored as text
  startDate: date("startDate"),
  endDate: date("endDate"),
  isCurrent: boolean("isCurrent").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

/**
 * Projects portfolio (bilingual with images)
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 100 }),
  technologies: text("technologies"), // JSON array stored as text
  projectUrl: varchar("projectUrl", { length: 500 }),
  isFeatured: boolean("isFeatured").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Skills with categories (bilingual)
 */
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  categoryEn: varchar("categoryEn", { length: 100 }),
  categoryAr: varchar("categoryAr", { length: 100 }),
  proficiency: int("proficiency").default(80), // 0-100
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Education history (bilingual)
 */
export const education = mysqlTable("education", {
  id: int("id").autoincrement().primaryKey(),
  institutionEn: varchar("institutionEn", { length: 255 }).notNull(),
  institutionAr: varchar("institutionAr", { length: 255 }),
  degreeEn: varchar("degreeEn", { length: 255 }).notNull(),
  degreeAr: varchar("degreeAr", { length: 255 }),
  fieldEn: varchar("fieldEn", { length: 255 }),
  fieldAr: varchar("fieldAr", { length: 255 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  isCurrent: boolean("isCurrent").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Education = typeof education.$inferSelect;
export type InsertEducation = typeof education.$inferInsert;

/**
 * Public reviews from visitors (with approval system)
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  reviewerEmail: varchar("reviewerEmail", { length: 320 }),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  isApproved: boolean("isApproved").default(false),
  isFeatured: boolean("isFeatured").default(false),
  adminReply: text("adminReply"),
  repliedAt: timestamp("repliedAt"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Professional testimonials (bilingual, admin-managed)
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  companyEn: varchar("companyEn", { length: 255 }),
  companyAr: varchar("companyAr", { length: 255 }),
  contentEn: text("contentEn").notNull(),
  contentAr: text("contentAr"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  isFeatured: boolean("isFeatured").default(false),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * About section talents/highlights (bilingual)
 */
export const talents = mysqlTable("talents", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  icon: varchar("icon", { length: 100 }), // Lucide icon name
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Talent = typeof talents.$inferSelect;
export type InsertTalent = typeof talents.$inferInsert;
