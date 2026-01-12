import { defineRelations } from "drizzle-orm";

import * as schema from "@/db/schema";

export const relations = defineRelations(schema, (r) => {
	return {
		bodies: {
			roles: r.many.roles({
				from: r.bodies.id.through(r.bodyToRole.a),
				to: r.roles.id.through(r.bodyToRole.b),
			}),
		},
		roles: {
			bodies: r.many.bodies(),
			contributions: r.many.contributions(),
		},
		countries: {
			institutions: r.many.institutions({
				from: r.countries.id.through(r.countryToInstitution.a),
				to: r.institutions.id.through(r.countryToInstitution.b),
			}),
			services: r.many.services({
				from: r.countries.id.through(r.countryToService.a),
				to: r.services.id.through(r.countryToService.b),
			}),
			software: r.many.software({
				from: r.countries.id.through(r.countryToSoftware.a),
				to: r.software.id.through(r.countryToSoftware.b),
			}),
			contributions: r.many.contributions(),
			outreaches: r.many.outreach(),
			reportCampaigns: r.many.reportCampaigns({
				from: r.countries.id.through(r.reports.countryId),
				to: r.reportCampaigns.id.through(r.reports.reportCampaignId),
			}),
			persons: r.many.persons({
				from: r.countries.id.through(r.users.countryId),
				to: r.persons.id.through(r.users.personId),
			}),
		},
		institutions: {
			countries: r.many.countries(),
			persons: r.many.persons({
				from: r.institutions.id.through(r.institutionToPerson.a),
				to: r.persons.id.through(r.institutionToPerson.b),
			}),
			services: r.many.services({
				from: r.institutions.id.through(r.institutionService.institutionId),
				to: r.services.id.through(r.institutionService.serviceId),
			}),
		},
		services: {
			countries: r.many.countries(),
			institutions: r.many.institutions(),
			reports: r.many.reports(),
		},
		software: {
			countries: r.many.countries(),
		},
		persons: {
			institutions: r.many.institutions(),
			contributions: r.many.contributions(),
			countries: r.many.countries(),
		},
		contributions: {
			country: r.one.countries({
				from: r.contributions.countryId,
				to: r.countries.id,
			}),
			person: r.one.persons({
				from: r.contributions.personId,
				to: r.persons.id,
			}),
			role: r.one.roles({
				from: r.contributions.roleId,
				to: r.roles.id,
			}),
			workingGroup: r.one.workingGroups({
				from: r.contributions.workingGroupId,
				to: r.workingGroups.id,
			}),
		},
		workingGroups: {
			contributions: r.many.contributions(),
			workingGroupOutreaches: r.many.workingGroupOutreach(),
			reportCampaigns: r.many.reportCampaigns(),
		},
		eventReports: {
			report: r.one.reports({
				from: r.eventReports.reportId,
				to: r.reports.id,
			}),
		},
		reports: {
			eventReports: r.many.eventReports(),
			outreaches: r.many.outreach(),
			projects: r.many.projects(),
			researchPolicyDevelopments: r.many.researchPolicyDevelopments(),
			services: r.many.services({
				from: r.reports.id.through(r.serviceReports.reportId),
				to: r.services.id.through(r.serviceReports.serviceId),
			}),
		},
		eventSizeValues: {
			reportCampaign: r.one.reportCampaigns({
				from: r.eventSizeValues.reportCampaignId,
				to: r.reportCampaigns.id,
			}),
		},
		reportCampaigns: {
			eventSizeValues: r.many.eventSizeValues(),
			outreachTypeValues: r.many.outreachTypeValues(),
			countries: r.many.countries(),
			roleTypeValues: r.many.roleTypeValues(),
			serviceSizeValues: r.many.serviceSizeValues(),
			workingGroups: r.many.workingGroups({
				from: r.reportCampaigns.id.through(r.workingGroupReports.reportCampaignId),
				to: r.workingGroups.id.through(r.workingGroupReports.workingGroupId),
			}),
		},
		outreach: {
			country: r.one.countries({
				from: r.outreach.countryId,
				to: r.countries.id,
			}),
			reports: r.many.reports({
				from: r.outreach.id.through(r.outreachReports.outreachId),
				to: r.reports.id.through(r.outreachReports.reportId),
			}),
		},
		outreachKpis: {
			outreachReport: r.one.outreachReports({
				from: r.outreachKpis.outreachReportId,
				to: r.outreachReports.id,
			}),
		},
		outreachReports: {
			outreachKpis: r.many.outreachKpis(),
		},
		outreachTypeValues: {
			reportCampaign: r.one.reportCampaigns({
				from: r.outreachTypeValues.reportCampaignId,
				to: r.reportCampaigns.id,
			}),
		},
		projects: {
			report: r.one.reports({
				from: r.projects.reportId,
				to: r.reports.id,
			}),
		},
		researchPolicyDevelopments: {
			report: r.one.reports({
				from: r.researchPolicyDevelopments.reportId,
				to: r.reports.id,
			}),
		},
		roleTypeValues: {
			reportCampaign: r.one.reportCampaigns({
				from: r.roleTypeValues.reportCampaignId,
				to: r.reportCampaigns.id,
			}),
		},
		serviceKpis: {
			serviceReport: r.one.serviceReports({
				from: r.serviceKpis.serviceReportId,
				to: r.serviceReports.id,
			}),
		},
		serviceReports: {
			serviceKpis: r.many.serviceKpis(),
		},
		serviceSizeValues: {
			reportCampaign: r.one.reportCampaigns({
				from: r.serviceSizeValues.reportCampaignId,
				to: r.reportCampaigns.id,
			}),
		},
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		users: {
			sessions: r.many.sessions(),
		},
		workingGroupEvents: {
			workingGroupReport: r.one.workingGroupReports({
				from: r.workingGroupEvents.reportId,
				to: r.workingGroupReports.id,
			}),
		},
		workingGroupReports: {
			workingGroupEvents: r.many.workingGroupEvents(),
		},
		workingGroupOutreach: {
			workingGroup: r.one.workingGroups({
				from: r.workingGroupOutreach.workingGroupId,
				to: r.workingGroups.id,
			}),
		},
	};
});
