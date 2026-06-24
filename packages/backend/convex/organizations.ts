import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { assertRole, ensureUser, getActiveOrganization, logAuditEvent, now, seedOrganizationDefaults } from "./_shared";

const contactsValidator = v.object({
  primaryName: v.optional(v.string()),
  primaryEmail: v.optional(v.string()),
  primaryPhone: v.optional(v.string()),
  complianceLead: v.optional(v.string()),
  complianceEmail: v.optional(v.string()),
  technicalLead: v.optional(v.string()),
  technicalEmail: v.optional(v.string()),
});

const preferencesValidator = v.object({
  reportingFrequency: v.optional(v.string()),
  reminderCadence: v.optional(v.string()),
  notificationEmail: v.optional(v.boolean()),
  notificationDashboard: v.optional(v.boolean()),
  weeklyDigest: v.optional(v.boolean()),
  languagePreference: v.optional(v.string()),
});

const brandingValidator = v.object({
  shortName: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization) return null;
    return {
      organization: active.organization,
      membership: active.membership,
      user: active.user,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    sector: v.string(),
    location: v.string(),
    employeeCount: v.number(),
    ictSupportStatus: v.string(),
    cloudUsageStatus: v.string(),
    riskOwner: v.string(),
    cyberFocalPoint: v.string(),
    companyProfile: v.optional(v.string()),
    website: v.optional(v.string()),
    contacts: v.optional(contactsValidator),
    selectedFrameworks: v.optional(v.array(v.string())),
    preferences: v.optional(preferencesValidator),
    branding: v.optional(brandingValidator),
  },
  handler: async (ctx, args) => {
    const { user } = await ensureUser(ctx);
    const timestamp = now();
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      sector: args.sector,
      location: args.location,
      sizeCategory: args.employeeCount <= 20 ? "small" : args.employeeCount <= 100 ? "medium" : "large",
      employeeCount: args.employeeCount,
      ictSupportStatus: args.ictSupportStatus,
      cloudUsageStatus: args.cloudUsageStatus,
      riskOwner: args.riskOwner,
      cyberFocalPoint: args.cyberFocalPoint,
      companyProfile: args.companyProfile,
      website: args.website,
      contacts: args.contacts,
      selectedFrameworks: args.selectedFrameworks ?? ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
      preferences: {
        reportingFrequency: args.preferences?.reportingFrequency ?? "monthly",
        reminderCadence: args.preferences?.reminderCadence ?? "weekly",
        notificationEmail: args.preferences?.notificationEmail ?? true,
        notificationDashboard: args.preferences?.notificationDashboard ?? true,
        weeklyDigest: args.preferences?.weeklyDigest ?? true,
        languagePreference: args.preferences?.languagePreference ?? "English",
      },
      branding: {
        shortName: args.branding?.shortName ?? args.name,
        primaryColor: args.branding?.primaryColor ?? "#0f766e",
        accentColor: args.branding?.accentColor ?? "#f59e0b",
        logoUrl: args.branding?.logoUrl,
      },
      readinessScore: 0,
      maturityLevel: 2,
      createdBy: user._id,
      nextReviewDate: "2026-07-17",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await ctx.db.insert("organizationMembers", {
      organizationId,
      userId: user._id,
      role: "owner",
      status: "active",
      createdAt: timestamp,
    });
    await ctx.db.patch(user._id, { activeOrganizationId: organizationId, role: "owner", updatedAt: timestamp });
    await seedOrganizationDefaults(ctx, organizationId, user);
    await logAuditEvent(ctx, {
      organizationId,
      userId: user._id,
      action: "organization.created",
      entityType: "organization",
      entityId: organizationId,
      metadata: { name: args.name },
    });
    return organizationId;
  },
});

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    sector: v.optional(v.string()),
    location: v.optional(v.string()),
    employeeCount: v.optional(v.number()),
    ictSupportStatus: v.optional(v.string()),
    cloudUsageStatus: v.optional(v.string()),
    riskOwner: v.optional(v.string()),
    cyberFocalPoint: v.optional(v.string()),
    companyProfile: v.optional(v.string()),
    website: v.optional(v.string()),
    contacts: v.optional(contactsValidator),
    selectedFrameworks: v.optional(v.array(v.string())),
    preferences: v.optional(preferencesValidator),
    branding: v.optional(brandingValidator),
  },
  handler: async (ctx, args) => {
    const active = await getActiveOrganization(ctx);
    if (!active?.organization || !active.membership) throw new Error("Organization setup required");
    assertRole(active.membership.role, ["owner", "admin", "consultant"]);

    await ctx.db.patch(active.organization._id, {
      ...Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined)),
      ...(args.employeeCount
        ? { sizeCategory: args.employeeCount <= 20 ? "small" : args.employeeCount <= 100 ? "medium" : "large" }
        : {}),
      updatedAt: now(),
    });

    const organization = await ctx.db.get(active.organization._id);
    if (organization) {
      const snapshot = await loadWorkspaceSnapshot(ctx, organization);
      await syncGeneratedActions(ctx, snapshot);
    }

    await logAuditEvent(ctx, {
      organizationId: active.organization._id,
      userId: active.user._id,
      action: "organization.updated",
      entityType: "organization",
      entityId: active.organization._id,
    });
    return await ctx.db.get(active.organization._id);
  },
});
