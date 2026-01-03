import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn(),
  getPersonalInfo: vi.fn().mockResolvedValue({
    id: 1,
    nameEn: "Yasser Sallam",
    nameAr: "ياسر سلام",
    titleEn: "Technical Creative & Production Expert",
    titleAr: "خبير تقني إبداعي وإنتاجي",
    bioEn: "Results-driven professional...",
    bioAr: "محترف يركز على النتائج...",
    email: "yassersalllam@gmail.com",
    phone: "+201000986942",
    whatsapp: "+201000986942",
    linkedin: "yasserious",
    location: "10th of Ramadan City, Egypt",
    avatarUrl: null,
    resumeUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getExperiences: vi.fn().mockResolvedValue([
    {
      id: 1,
      titleEn: "CNC Production Engineer",
      titleAr: "مهندس إنتاج CNC",
      companyEn: "Larouch for Wooden Furniture",
      companyAr: "لاروش للأثاث الخشبي",
      locationEn: "10th of Ramadan City",
      locationAr: "مدينة العاشر من رمضان",
      startDate: new Date("2024-08-01"),
      endDate: null,
      isCurrent: true,
      descriptionEn: "Operate and program CNC machines",
      descriptionAr: "تشغيل وبرمجة ماكينات CNC",
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getProjects: vi.fn().mockResolvedValue([
    {
      id: 1,
      titleEn: "Modern Kitchen Design",
      titleAr: "تصميم مطبخ حديث",
      descriptionEn: "Complete CNC production for a luxury modern kitchen",
      descriptionAr: "إنتاج CNC كامل لمطبخ حديث فاخر",
      imageUrl: null,
      category: "kitchen",
      isFeatured: true,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getSkills: vi.fn().mockResolvedValue([
    {
      id: 1,
      nameEn: "WoodWOP 7.2",
      nameAr: "وود ووب 7.2",
      category: "CNC Programming",
      proficiency: 95,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getEducation: vi.fn().mockResolvedValue([
    {
      id: 1,
      degreeEn: "B.Sc.",
      degreeAr: "بكالوريوس",
      fieldEn: "Management Information Systems",
      fieldAr: "نظم المعلومات الإدارية",
      institutionEn: "Higher Technological Institute",
      institutionAr: "المعهد التكنولوجي العالي",
      startYear: 2012,
      endYear: 2016,
      descriptionEn: null,
      descriptionAr: null,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getApprovedReviews: vi.fn().mockResolvedValue([]),
  getReviewStats: vi.fn().mockResolvedValue({ averageRating: 0, totalReviews: 0 }),
  getTalents: vi.fn().mockResolvedValue([]),
  getTestimonials: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Portfolio Public API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("portfolio.getPersonalInfo", () => {
    it("returns personal info successfully", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getPersonalInfo();

      expect(result).toBeDefined();
      expect(result?.nameEn).toBe("Yasser Sallam");
      expect(result?.nameAr).toBe("ياسر سلام");
      expect(result?.email).toBe("yassersalllam@gmail.com");
    });
  });

  describe("portfolio.getExperiences", () => {
    it("returns experiences list", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getExperiences();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].titleEn).toBe("CNC Production Engineer");
    });
  });

  describe("portfolio.getProjects", () => {
    it("returns projects list", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getProjects();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].titleEn).toBe("Modern Kitchen Design");
    });
  });

  describe("portfolio.getSkills", () => {
    it("returns skills list", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getSkills();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].nameEn).toBe("WoodWOP 7.2");
    });
  });

  describe("portfolio.getEducation", () => {
    it("returns education list", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getEducation();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].degreeEn).toBe("B.Sc.");
    });
  });

  describe("portfolio.getApprovedReviews", () => {
    it("returns approved reviews", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getApprovedReviews();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("portfolio.getReviewStats", () => {
    it("returns review statistics", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getReviewStats();

      expect(result).toBeDefined();
      expect(typeof result.averageRating).toBe("number");
      expect(typeof result.totalReviews).toBe("number");
    });
  });
});

describe("Auth API", () => {
  describe("auth.me", () => {
    it("returns null for unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeNull();
    });

    it("returns user for authenticated user", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeDefined();
      expect(result?.name).toBe("Admin User");
      expect(result?.role).toBe("admin");
    });
  });

  describe("auth.logout", () => {
    it("clears session cookie and returns success", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(ctx.res.clearCookie).toHaveBeenCalled();
    });
  });
});
