import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin check middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PUBLIC PORTFOLIO DATA ============
  portfolio: router({
    getPersonalInfo: publicProcedure.query(async () => {
      return db.getPersonalInfo();
    }),
    
    getExperiences: publicProcedure.query(async () => {
      return db.getExperiences();
    }),
    
    getProjects: publicProcedure.query(async () => {
      return db.getProjects();
    }),
    
    getFeaturedProjects: publicProcedure.query(async () => {
      return db.getFeaturedProjects();
    }),
    
    getSkills: publicProcedure.query(async () => {
      return db.getSkills();
    }),
    
    getEducation: publicProcedure.query(async () => {
      return db.getEducation();
    }),
    
    getTestimonials: publicProcedure.query(async () => {
      return db.getFeaturedTestimonials();
    }),
    
    getTalents: publicProcedure.query(async () => {
      return db.getTalents();
    }),
    
    getApprovedReviews: publicProcedure.query(async () => {
      return db.getApprovedReviews();
    }),
    
    getReviewStats: publicProcedure.query(async () => {
      return db.getReviewStats();
    }),
    
    // Public review submission
    submitReview: publicProcedure
      .input(z.object({
        reviewerName: z.string().min(2).max(255),
        reviewerEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10).max(1000),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createReview({
          reviewerName: input.reviewerName,
          reviewerEmail: input.reviewerEmail || null,
          rating: input.rating,
          comment: input.comment,
          isApproved: false,
        });
        return { success: true, id };
      }),
  }),

  // ============ ADMIN DASHBOARD ============
  admin: router({
    // Personal Info
    updatePersonalInfo: adminProcedure
      .input(z.object({
        fullNameEn: z.string().optional(),
        fullNameAr: z.string().optional(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        bioEn: z.string().optional(),
        bioAr: z.string().optional(),
        summaryEn: z.string().optional(),
        summaryAr: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        whatsapp: z.string().optional(),
        linkedinUrl: z.string().optional(),
        locationEn: z.string().optional(),
        locationAr: z.string().optional(),
        avatarUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertPersonalInfo(input);
        return { success: true };
      }),

    // Experiences
    getExperiences: adminProcedure.query(async () => {
      return db.getExperiences();
    }),
    
    createExperience: adminProcedure
      .input(z.object({
        companyEn: z.string().min(1),
        companyAr: z.string().optional(),
        positionEn: z.string().min(1),
        positionAr: z.string().optional(),
        locationEn: z.string().optional(),
        locationAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        responsibilitiesEn: z.string().optional(),
        responsibilitiesAr: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createExperience({
          ...input,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
        });
        return { success: true, id };
      }),
    
    updateExperience: adminProcedure
      .input(z.object({
        id: z.number(),
        companyEn: z.string().optional(),
        companyAr: z.string().optional(),
        positionEn: z.string().optional(),
        positionAr: z.string().optional(),
        locationEn: z.string().optional(),
        locationAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        responsibilitiesEn: z.string().optional(),
        responsibilitiesAr: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateExperience(id, {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        });
        return { success: true };
      }),
    
    deleteExperience: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteExperience(input.id);
        return { success: true };
      }),

    // Projects
    getProjects: adminProcedure.query(async () => {
      return db.getProjects();
    }),
    
    createProject: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        technologies: z.string().optional(),
        projectUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createProject(input);
        return { success: true, id };
      }),
    
    updateProject: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        technologies: z.string().optional(),
        projectUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),
    
    deleteProject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),

    // Skills
    getSkills: adminProcedure.query(async () => {
      return db.getSkills();
    }),
    
    createSkill: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().optional(),
        categoryEn: z.string().optional(),
        categoryAr: z.string().optional(),
        proficiency: z.number().min(0).max(100).optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createSkill(input);
        return { success: true, id };
      }),
    
    updateSkill: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        categoryEn: z.string().optional(),
        categoryAr: z.string().optional(),
        proficiency: z.number().min(0).max(100).optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateSkill(id, data);
        return { success: true };
      }),
    
    deleteSkill: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSkill(input.id);
        return { success: true };
      }),

    // Education
    getEducation: adminProcedure.query(async () => {
      return db.getEducation();
    }),
    
    createEducation: adminProcedure
      .input(z.object({
        institutionEn: z.string().min(1),
        institutionAr: z.string().optional(),
        degreeEn: z.string().min(1),
        degreeAr: z.string().optional(),
        fieldEn: z.string().optional(),
        fieldAr: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createEducation({
          ...input,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
        });
        return { success: true, id };
      }),
    
    updateEducation: adminProcedure
      .input(z.object({
        id: z.number(),
        institutionEn: z.string().optional(),
        institutionAr: z.string().optional(),
        degreeEn: z.string().optional(),
        degreeAr: z.string().optional(),
        fieldEn: z.string().optional(),
        fieldAr: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrent: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEducation(id, {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        });
        return { success: true };
      }),
    
    deleteEducation: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEducation(input.id);
        return { success: true };
      }),

    // Reviews Management
    getAllReviews: adminProcedure.query(async () => {
      return db.getAllReviews();
    }),
    
    approveReview: adminProcedure
      .input(z.object({ id: z.number(), approved: z.boolean() }))
      .mutation(async ({ input }) => {
        await db.approveReview(input.id, input.approved);
        return { success: true };
      }),
    
    replyToReview: adminProcedure
      .input(z.object({ id: z.number(), reply: z.string() }))
      .mutation(async ({ input }) => {
        await db.replyToReview(input.id, input.reply);
        return { success: true };
      }),
    
    deleteReview: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteReview(input.id);
        return { success: true };
      }),

    // Testimonials
    getTestimonials: adminProcedure.query(async () => {
      return db.getTestimonials();
    }),
    
    createTestimonial: adminProcedure
      .input(z.object({
        nameEn: z.string().min(1),
        nameAr: z.string().optional(),
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        companyEn: z.string().optional(),
        companyAr: z.string().optional(),
        contentEn: z.string().min(1),
        contentAr: z.string().optional(),
        avatarUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createTestimonial(input);
        return { success: true, id };
      }),
    
    updateTestimonial: adminProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        companyEn: z.string().optional(),
        companyAr: z.string().optional(),
        contentEn: z.string().optional(),
        contentAr: z.string().optional(),
        avatarUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTestimonial(id, data);
        return { success: true };
      }),
    
    deleteTestimonial: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTestimonial(input.id);
        return { success: true };
      }),

    // Talents
    getTalents: adminProcedure.query(async () => {
      return db.getTalents();
    }),
    
    createTalent: adminProcedure
      .input(z.object({
        titleEn: z.string().min(1),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createTalent(input);
        return { success: true, id };
      }),
    
    updateTalent: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(),
        titleAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTalent(id, data);
        return { success: true };
      }),
    
    deleteTalent: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTalent(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
