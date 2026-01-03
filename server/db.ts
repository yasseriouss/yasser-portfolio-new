import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  personalInfo, InsertPersonalInfo, PersonalInfo,
  experiences, InsertExperience, Experience,
  projects, InsertProject, Project,
  skills, InsertSkill, Skill,
  education, InsertEducation, Education,
  reviews, InsertReview, Review,
  testimonials, InsertTestimonial, Testimonial,
  talents, InsertTalent, Talent
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PERSONAL INFO FUNCTIONS ============
export async function getPersonalInfo(): Promise<PersonalInfo | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(personalInfo).limit(1);
  return result[0];
}

export async function upsertPersonalInfo(data: Partial<InsertPersonalInfo>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const existing = await getPersonalInfo();
  if (existing) {
    await db.update(personalInfo).set(data).where(eq(personalInfo.id, existing.id));
  } else {
    await db.insert(personalInfo).values(data as InsertPersonalInfo);
  }
}

// ============ EXPERIENCES FUNCTIONS ============
export async function getExperiences(): Promise<Experience[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(experiences).orderBy(asc(experiences.displayOrder), desc(experiences.startDate));
}

export async function getExperienceById(id: number): Promise<Experience | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return result[0];
}

export async function createExperience(data: InsertExperience): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(experiences).values(data);
  return result[0].insertId;
}

export async function updateExperience(id: number, data: Partial<InsertExperience>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(experiences).set(data).where(eq(experiences.id, id));
}

export async function deleteExperience(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(experiences).where(eq(experiences.id, id));
}

// ============ PROJECTS FUNCTIONS ============
export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(asc(projects.displayOrder), desc(projects.createdAt));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.isFeatured, true)).orderBy(asc(projects.displayOrder));
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(data: InsertProject): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result[0].insertId;
}

export async function updateProject(id: number, data: Partial<InsertProject>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function deleteProject(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(projects).where(eq(projects.id, id));
}

// ============ SKILLS FUNCTIONS ============
export async function getSkills(): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(skills).orderBy(asc(skills.displayOrder));
}

export async function getSkillById(id: number): Promise<Skill | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return result[0];
}

export async function createSkill(data: InsertSkill): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(skills).values(data);
  return result[0].insertId;
}

export async function updateSkill(id: number, data: Partial<InsertSkill>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(skills).set(data).where(eq(skills.id, id));
}

export async function deleteSkill(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(skills).where(eq(skills.id, id));
}

// ============ EDUCATION FUNCTIONS ============
export async function getEducation(): Promise<Education[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(education).orderBy(asc(education.displayOrder), desc(education.startDate));
}

export async function getEducationById(id: number): Promise<Education | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(education).where(eq(education.id, id)).limit(1);
  return result[0];
}

export async function createEducation(data: InsertEducation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(education).values(data);
  return result[0].insertId;
}

export async function updateEducation(id: number, data: Partial<InsertEducation>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(education).set(data).where(eq(education.id, id));
}

export async function deleteEducation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(education).where(eq(education.id, id));
}

// ============ REVIEWS FUNCTIONS ============
export async function getApprovedReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function getReviewById(id: number): Promise<Review | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return result[0];
}

export async function createReview(data: InsertReview): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviews).values(data);
  return result[0].insertId;
}

export async function updateReview(id: number, data: Partial<InsertReview>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set(data).where(eq(reviews.id, id));
}

export async function deleteReview(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(reviews).where(eq(reviews.id, id));
}

export async function approveReview(id: number, approved: boolean): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set({ isApproved: approved }).where(eq(reviews.id, id));
}

export async function replyToReview(id: number, reply: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set({ adminReply: reply, repliedAt: new Date() }).where(eq(reviews.id, id));
}

// ============ TESTIMONIALS FUNCTIONS ============
export async function getTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.isFeatured, true)).orderBy(asc(testimonials.displayOrder));
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return result[0];
}

export async function createTestimonial(data: InsertTestimonial): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(testimonials).values(data);
  return result[0].insertId;
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ============ TALENTS FUNCTIONS ============
export async function getTalents(): Promise<Talent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(talents).orderBy(asc(talents.displayOrder));
}

export async function getTalentById(id: number): Promise<Talent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(talents).where(eq(talents.id, id)).limit(1);
  return result[0];
}

export async function createTalent(data: InsertTalent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(talents).values(data);
  return result[0].insertId;
}

export async function updateTalent(id: number, data: Partial<InsertTalent>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(talents).set(data).where(eq(talents.id, id));
}

export async function deleteTalent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(talents).where(eq(talents.id, id));
}

// ============ STATS FUNCTIONS ============
export async function getReviewStats(): Promise<{ total: number; average: number; approved: number }> {
  const db = await getDb();
  if (!db) return { total: 0, average: 0, approved: 0 };
  
  const allReviews = await db.select().from(reviews);
  const approvedReviews = allReviews.filter(r => r.isApproved);
  
  const total = allReviews.length;
  const approved = approvedReviews.length;
  const average = approved > 0 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approved 
    : 0;
  
  return { total, average: Math.round(average * 10) / 10, approved };
}
